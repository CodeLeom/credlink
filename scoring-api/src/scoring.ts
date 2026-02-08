import type { Signals, ScoreResponse } from "./types.js";

export const MODEL_VERSION = "v1.0.0";

const FIXED_SCORES: Record<string, number> = {
  "0x1111111111111111111111111111111111111111": 820,
  "0x2222222222222222222222222222222222222222": 720,
  "0x3333333333333333333333333333333333333333": 560,
};

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

export const computeScore = (signals: Signals): number => {
  const base = 600;
  const ageBoost = Math.min(signals.walletAgeDays / 10, 80);
  const txBoost = Math.min(signals.txCount30d * 2, 60);
  const balanceBoost = Math.min(Math.log10(signals.avgBalanceUsd + 1) * 40, 80);
  const repaymentBoost = signals.repaymentOnchain * 60;
  const rawScore = base + ageBoost + txBoost + balanceBoost + repaymentBoost;
  const clamped = clamp(rawScore, 300, 900);
  return Math.floor(clamped);
};

const seedFromAddress = (user: string): number => {
  const normalized = user.toLowerCase();
  const tail = normalized.slice(-8);
  return parseInt(tail, 16);
};

export const signalsFromAddress = (user: string): Signals => {
  const seed = seedFromAddress(user);
  return {
    walletAgeDays: 30 + (seed % 365),
    txCount30d: 1 + ((seed >> 4) % 40),
    avgBalanceUsd: 50 + ((seed >> 8) % 5000),
    repaymentOnchain: seed % 2,
  };
};

export const scoreForUser = (user: string, mode: string | undefined): ScoreResponse => {
  const normalized = user.toLowerCase();
  if (mode === "mock" && normalized in FIXED_SCORES) {
    const signals = signalsFromAddress(normalized);
    return {
      user: normalized,
      score: FIXED_SCORES[normalized],
      modelVersion: MODEL_VERSION,
      signals,
    };
  }

  const signals = signalsFromAddress(normalized);
  const score = computeScore(signals);
  return {
    user: normalized,
    score,
    modelVersion: MODEL_VERSION,
    signals,
  };
};
