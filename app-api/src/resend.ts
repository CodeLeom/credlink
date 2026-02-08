import { Resend } from "resend";
import type { RequestRecord } from "./requests.js";

const apiKey = process.env.RESEND_API_KEY || "";
const emailFrom = process.env.EMAIL_FROM || "CredLink <noreply@credlink.dev>";
const adminEmail = process.env.ADMIN_EMAIL || "admin@credlink.dev";

const resend = apiKey ? new Resend(apiKey) : null;

const safeSend = async (params: { to: string; subject: string; text: string }) => {
  if (!resend) {
    console.warn("RESEND_API_KEY not set. Skipping email.");
    return;
  }
  try {
    await resend.emails.send({
      from: emailFrom,
      to: params.to,
      subject: params.subject,
      text: params.text,
    });
  } catch (error) {
    console.error("Email send failed:", error);
  }
};

export const sendAdminNewRequest = async (request: RequestRecord) => {
  await safeSend({
    to: adminEmail,
    subject: "New Credit Score Request",
    text: `New request\n\nID: ${request.id}\nWallet: ${request.wallet}\nEmail: ${request.userEmail}`,
  });
};

export const sendUserApproved = async (request: RequestRecord) => {
  await safeSend({
    to: request.userEmail,
    subject: "Your credit score request was approved",
    text: `Your request was approved and is being scored.\n\nID: ${request.id}\nWallet: ${request.wallet}`,
  });
};

export const sendUserRejected = async (request: RequestRecord) => {
  await safeSend({
    to: request.userEmail,
    subject: "Credit score request rejected",
    text: `Your request was rejected.\n\nID: ${request.id}\nWallet: ${request.wallet}`,
  });
};

export const sendUserScored = async (request: RequestRecord) => {
  const txLink = request.txHash
    ? `https://sepolia.etherscan.io/tx/${request.txHash}`
    : "";
  await safeSend({
    to: request.userEmail,
    subject: "Your credit score is ready",
    text: `Your score is ready.\n\nID: ${request.id}\nWallet: ${request.wallet}\nScore: ${request.score ?? "N/A"}\nTx: ${txLink}`,
  });
};
