import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(rpcUrl || undefined),
  },
});
