import dotenv from "dotenv";

dotenv.config();

export type WorkflowConfig = {
  rpcUrl: string;
  privateKey: string;
  bureauAddress: string;
  scoringApiUrl: string;
};

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const loadConfig = (): WorkflowConfig => {
  return {
    rpcUrl: requireEnv("SEPOLIA_RPC_URL"),
    privateKey: requireEnv("WORKFLOW_SIGNER_PRIVATE_KEY"),
    bureauAddress: requireEnv("CREDIT_BUREAU_ADDRESS"),
    scoringApiUrl: requireEnv("SCORING_API_URL"),
  };
};
