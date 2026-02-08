export type RequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SCORING"
  | "SCORED"
  | "FAILED";

export type RequestRecord = {
  id: string;
  userEmail: string;
  wallet: string;
  status: RequestStatus;
  score?: number;
  txHash?: string;
  adminNote?: string;
  createdAt: number;
  updatedAt: number;
};

export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isValidWallet = (value: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
};
