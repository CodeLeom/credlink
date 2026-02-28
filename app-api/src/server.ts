import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { initDb } from "./db.js";
import { isValidEmail, isValidWallet } from "./requests.js";
import {
  sendAdminNewRequest,
  sendUserApproved,
  sendUserRejected,
  sendUserScored,
} from "./resend.js";
import { triggerWorkflow } from "./workflowClient.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const port = Number(process.env.PORT || 4000);
const adminToken = process.env.ADMIN_TOKEN || "";
const db = initDb(process.env.DATABASE_URL);

const requireAdmin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authHeader = String(req.headers.authorization || "");
  const token = authHeader.replace("Bearer ", "");
  if (!token || token !== adminToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
};

const asyncHandler =
  (handler: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(handler(req, res, next)).catch(next);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post(
  "/requests",
  asyncHandler(async (req, res) => {
    const { userEmail, wallet } = req.body || {};
    if (!userEmail || !wallet) {
      return res.status(400).json({ error: "Missing userEmail or wallet" });
    }
    if (!isValidEmail(String(userEmail))) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (!isValidWallet(String(wallet))) {
      return res.status(400).json({ error: "Invalid wallet" });
    }

    const request = db.createRequest({
      userEmail: String(userEmail),
      wallet: String(wallet),
    });
    await sendAdminNewRequest(request);

    return res.json({ id: request.id, status: request.status });
  }),
);

app.get("/requests/:id", (req, res) => {
  const request = db.getRequest(req.params.id);
  if (!request) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.json({
    id: request.id,
    wallet: request.wallet,
    status: request.status,
    score: request.score,
    txHash: request.txHash,
  });
});

app.get("/admin/requests", requireAdmin, (req, res) => {
  const status = req.query.status ? String(req.query.status) : undefined;
  const requests = db.listRequests(status as any);
  return res.json({ requests });
});

app.post(
  "/admin/requests/:id/approve",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const request = db.getRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Not found" });
    }

    const approved = db.updateRequest(request.id, { status: "APPROVED" });
    if (approved) {
      await sendUserApproved(approved);
    }

    db.updateRequest(request.id, { status: "SCORING" });

    try {
      const result = await triggerWorkflow(request.wallet);
      const updated = db.updateRequest(request.id, {
        status: "SCORED",
        txHash: result.txHash,
      });
      if (updated) {
        await sendUserScored(updated);
      }
      return res.json({ status: "SCORED", txHash: result.txHash });
    } catch (error) {
      console.error("Workflow trigger failed:", error);
      db.updateRequest(request.id, { status: "FAILED" });
      return res
        .status(500)
        .json({
          error: error instanceof Error ? error.message : "Workflow failed",
        });
    }
  }),
);

app.post(
  "/admin/requests/:id/reject",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const request = db.getRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Not found" });
    }

    const updated = db.updateRequest(request.id, { status: "REJECTED" });
    if (updated) {
      await sendUserRejected(updated);
    }

    return res.json({ status: "REJECTED" });
  }),
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App API listening on port ${port}`);
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
});
