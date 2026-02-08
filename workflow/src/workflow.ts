import { readFileSync } from "node:fs";
import { loadConfig } from "./config.js";
import { Contract, JsonRpcProvider, Wallet, isAddress, keccak256, toUtf8Bytes } from "ethers";

const parseArg = (flag: string): string | undefined => {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
};

const clampScore = (value: number): number => {
  const clamped = Math.max(300, Math.min(900, Math.floor(value)));
  return clamped;
};

const fetchScore = async (scoringApiUrl: string, user: string) => {
  const response = await fetch(`${scoringApiUrl}/score?user=${user}`);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Scoring API error: ${response.status} ${body}`);
  }
  return response.json();
};

const loadAbi = () => {
  const abiPath = new URL("./abi/CreditBureau.json", import.meta.url);
  return JSON.parse(readFileSync(abiPath, "utf-8"));
};

const main = async () => {
  const mode = parseArg("--mode") || "simulate";
  const user = parseArg("--user");
  if (!user) {
    throw new Error("Missing --user argument");
  }
  if (!isAddress(user)) {
    throw new Error("Invalid user address");
  }

  const config = loadConfig();
  const scoreResponse = await fetchScore(config.scoringApiUrl, user);
  const scoreU16 = clampScore(Number(scoreResponse.score));

  const signalsHash = keccak256(toUtf8Bytes(JSON.stringify(scoreResponse.signals)));
  const modelVersionBytes32 = keccak256(toUtf8Bytes(String(scoreResponse.modelVersion)));

  let txHash = "";

  if (mode === "broadcast") {
    const provider = new JsonRpcProvider(config.rpcUrl);
    const wallet = new Wallet(config.privateKey, provider);
    const abi = loadAbi();
    const contract = new Contract(config.bureauAddress, abi, wallet);

    const tx = await contract.setScore(user, scoreU16, modelVersionBytes32, signalsHash);
    const receipt = await tx.wait(1);
    txHash = receipt?.hash || tx.hash;
  }

  const output = {
    user,
    score: scoreU16,
    modelVersion: String(scoreResponse.modelVersion),
    modelVersionBytes32,
    signalsHash,
    txHash,
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(output, null, 2));
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
