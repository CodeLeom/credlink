export type Signals = {
  walletAgeDays: number;
  txCount30d: number;
  avgBalanceUsd: number;
  repaymentOnchain: number;
};

export type ScoreResponse = {
  user: string;
  score: number;
  modelVersion: string;
  signals: Signals;
};
