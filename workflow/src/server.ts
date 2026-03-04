import dotenv from "dotenv";
import express from "express";
import { runWorkflow } from "./workflow.js";
import { loadConfig } from "./config.js";

dotenv.config();

const app = express();
app.use(express.json());

const port = Number(process.env.WORKFLOW_PORT || 3002);
const mode = (process.env.WORKFLOW_MODE || "broadcast") as "simulate" | "broadcast";

let config: ReturnType<typeof loadConfig> | null = null;
try {
  config = loadConfig();
} catch (err) {
  console.error("Failed to load config:", err instanceof Error ? err.message : err);
  process.exit(1);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, mode });
});

app.post("/", async (req, res) => {
  const { user } = req.body || {};

  if (!user || typeof user !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'user' address" });
  }

  try {
    console.log(`[workflow] Processing request for ${user} in ${mode} mode`);
    const result = await runWorkflow(user, mode, config!);
    console.log(`[workflow] Success: score=${result.score}, txHash=${result.txHash || "(simulated)"}`);
    return res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[workflow] Error for ${user}:`, message);
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Workflow server listening on port ${port} (mode: ${mode})`);
});
