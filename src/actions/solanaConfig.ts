import { TxVersion } from '@raydium-io/raydium-sdk-v2';
import { Connection, Keypair } from '@solana/web3.js';

// Use environment variable or fallback to public RPC
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com';

export const connection = new Connection(rpcUrl, 'confirmed');

console.log("Solana RPC URL:", rpcUrl);
export const txVersion = TxVersion.V0; // or TxVersion.LEGACY
export const userWallet = Keypair.generate();
export const burnerWallet = Keypair.generate();