import express from "express";
import dotenv from "dotenv";
import { scoreForUser } from "./scoring.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const mode = process.env.SCORING_MODE;

const isValidAddress = (user: string) => /^0x[a-fA-F0-9]{40}$/.test(user);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/score", (req, res) => {
  const user = String(req.query.user || "");
  if (!user) {
    return res.status(400).json({ error: "Missing user parameter" });
  }
  if (!isValidAddress(user)) {
    return res.status(400).json({ error: "Invalid user address" });
  }

  const payload = scoreForUser(user, mode);
  return res.json(payload);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Scoring API listening on port ${port}`);
});
