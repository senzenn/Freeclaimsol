"use client"
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, TrendingUp, RefreshCcw, AlertTriangle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import {Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { connection } from "@/actions/solanaConfig";
import { GradientButton } from "@/components/ui/gradient-button";


interface ApiResponse {
  tokenAccountData: any;
  closeInstructions: any[];
  emptyAccountsCount: number;
  totalatas: number;
  usdrecieve: string;
  max_len_account: number | null,
  platformFeeLamports:number,
  totalamports: number
}

export default function Analysis() {
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [signature,setSignature] = useState<string>("");

  const { publicKey ,signTransaction} = useWallet();

  const platformWalletKeypair = (() => {
    try {
      const walletKey = process.env.NEXT_PUBLIC_PLATFORM_WALLET;
      if (!walletKey) {
        console.error('NEXT_PUBLIC_PLATFORM_WALLET environment variable is not set');
        return null;
      }
      return Keypair.fromSecretKey(bs58.decode(walletKey));
    } catch (error) {
      console.error('Failed to decode platform wallet:', error);
      return null;
    }
  })();
  // Computed values from API data
  const totalATAs = apiData?.totalatas || 0;
  const unusedATAs = apiData?.emptyAccountsCount || 0;

  const recoverableAmount = apiData?.usdrecieve || "0";

  const networkFee = 0.001;

  // Progress bar animation effect
  useEffect(() => {
    if (isLoading && progress < 90) {
      const timeout = setTimeout(() => setProgress(prev => prev + Math.random() * 10), 200);
      return () => clearTimeout(timeout);
    }
  }, [progress, isLoading]);

  // Fetch data from API

  const fetchAccountData = async () => {
    if (!publicKey) {
      console.error('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setShowResult(false);
    console.log("Fetching data for public key:", publicKey.toBase58());

    try {
      const response = await fetch('/api/fetchTokenAccountData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
      });

      const data = await response.json();
      console.log("Data received",data)
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch account data');
      }

      setProgress(100);

      setTimeout(() => {
        setApiData(data);
        setIsLoading(false);
        setShowResult(true);
      }, 500);

    } catch (error) {
      console.error('Error fetching account data:', error);
      setIsLoading(false);
      setProgress(0);
    }
  };

  // Handle the recovery process (signing and sending transaction)
const handleRecovery = async () => {

  if (!publicKey || !apiData) {
    console.error('Wallet not connected or no data available');
    return;
  }

  if (!platformWalletKeypair) {
    console.error('Platform wallet is not configured');
    return;
  }

  if (apiData.emptyAccountsCount === 0) {
    console.log('No empty token accounts found');
    return;
  }

  if (!signTransaction) {
    console.error('signTransaction function not available');
    return;
  }

  setIsProcessing(true);

  try {
    // Reconstruct instructions from serialized data
    const instructions: TransactionInstruction[] = apiData.closeInstructions.map((serializedIx: any) => {
      const keys = serializedIx.keys.map((key: any) => ({
        pubkey: new PublicKey(key.pubkey),
        isSigner: key.isSigner,
        isWritable: key.isWritable,
      }));

      return new TransactionInstruction({
        keys,
        programId: new PublicKey(serializedIx.programId),
        data: Buffer.from(serializedIx.data),
      });
    });


    // creating fee instruction

    const transferItx =  SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: platformWalletKeypair.publicKey,
      lamports: apiData.platformFeeLamports
    });

    instructions.push(transferItx);


    const transaction = new Transaction();


    transaction.add(...instructions);

    const {blockhash} = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = platformWalletKeypair.publicKey;

    console.log("here is the recent blockhash", blockhash);

    const userSignedTransaction = await signTransaction(transaction);






    console.log("here is the platform key", platformWalletKeypair.publicKey.toBase58());
    userSignedTransaction.partialSign(platformWalletKeypair)



    if(userSignedTransaction){
      console.log("user successfuly signed transaction--------", userSignedTransaction);
    }


    const result = await connection.sendRawTransaction(userSignedTransaction.serialize());

    console.log("here is the resultttt", result);



    console.log('Successfully closed', apiData.emptyAccountsCount, 'empty token accounts');

    // Show success modal instead of immediately refetching
    setSignature(result);
    setShowSuccessModal(true);
    return;
  } catch (error) {
    console.error('Error closing accounts:', error);

    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  } finally {
    setIsProcessing(false);
  }
};

  // Auto-fetch data when component mounts and wallet is connected
  useEffect(() => {
    if (publicKey && !showResult && !isLoading) {
      fetchAccountData();
    }
  }, [publicKey]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0 space-y-4">
      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="bg-gradient-to-br from-[#23263a] to-[#181c2b] rounded-2xl shadow-2xl border border-[#5B698B] p-8 max-w-md w-full text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15"/><path d="M7 13l3 3 7-7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h2 className="text-2xl font-bold text-white">SOL Received!</h2>

              <a
                href={`https://solscan.io/tx/${signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#4fd1c5] hover:underline break-all"
              >
                View Transaction: {signature}
              </a>

              <p className="text-white/80 text-base">You have successfully received your SOL.<br/>We are now refetching your account data.</p>
              <GradientButton
                className="mt-4"
                onClick={async () => {
                  setShowSuccessModal(false);
                  await fetchAccountData();
                }}
              >
                Okay
              </GradientButton>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Progress Bar */}
      {isLoading && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/90 font-medium">Analyzing your wallet...</span>
            <span className="text-white/70 text-xs">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#000080] shadow-[0_0_20px_#003366]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results Section */}
      {showResult && apiData && (
        <div className="space-y-4">
          {/* ATA Analysis */}
          <div className="rounded-2xl p-7 shadow-[0_10px_40px_rgba(0,0,0,0.45)] border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-1">
              {/* <FileText className="text-[#8096D2] w-6 h-6" /> */}
              <span className="text-2xl font-bold text-white">ATA Analysis</span>
            </div>
            <div className="text-white/70 mb-6">Analyzing your Associated Token Accounts for recovery opportunities</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center rounded-xl p-6 border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition-colors">
                {/* <FileText className="w-8 h-8 text-[#4fd1c5] mb-2" /> */}
                <div className="text-3xl font-bold text-white">{totalATAs}</div>
                <div className="text-white/60 mt-1">Total ATAs</div>
              </div>
              <div className="flex flex-col items-center rounded-xl p-6 border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition-colors">
                {/* <TrendingUp className="w-8 h-8 text-[#fbbf24] mb-2" /> */}
                <div className="text-3xl font-bold text-white">{unusedATAs}</div>
                <div className="text-white/60 mt-1">Unused ATAs</div>
              </div>
              <div className="flex flex-col items-center rounded-xl p-6 border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition-colors">
                {/* <RefreshCcw className="w-8 h-8 text-[#22c55e] mb-2" /> */}
                <div className="text-3xl font-bold text-white">{apiData.max_len_account? apiData.totalamports: recoverableAmount}</div>
                <div className="text-white/60 mt-1">Recoverable SOL</div>
              </div>
            </div>
          </div>

          {/* SOL Recovery */}
          <div className="rounded-2xl p-7 shadow-[0_10px_40px_rgba(0,0,0,0.45)] border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-1">
              {/* <RefreshCcw className="text-[#4fd1c5] w-6 h-6" /> */}
              <span className="text-2xl font-bold text-white">SOL Recovery</span>
            </div>
            <div className="text-white/70 mb-6">Close unused ATAs and recover your locked SOL</div>
            <div className="rounded-xl p-5 mb-5 border border-white/10 bg-white/[0.04]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">ATAs to close:</span>
                <span className="text-white font-semibold text-lg">{apiData.max_len_account? `15/${unusedATAs}`:unusedATAs}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Estimated recovery:</span>
                <span className="text-[#4fd1c5] font-semibold text-lg">{recoverableAmount} SOL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Transaction fees (we pay!):</span>
                <span className="text-white/60">~{networkFee} SOL</span>
              </div>
            </div>
            <div className="rounded-xl p-4 flex items-center gap-3 mb-5 border border-yellow-600/30 bg-yellow-500/5">
              <AlertTriangle className="text-yellow-400 w-6 h-6" />
              <div>
                <div className="text-yellow-400 font-semibold">Important Notice</div>
                <div className="text-yellow-200/80 text-sm mt-1">This action will permanently close the selected ATAs. Make sure you don't need these token accounts before proceeding.</div>
              </div>
            </div>

            {unusedATAs > 0 ? (
              <GradientButton
                className="group w-full mt-2 relative overflow-hidden text-lg py-3 flex items-center justify-center gap-2"
                onClick={handleRecovery}
                disabled={isProcessing}
              >
                <span className="absolute inset-0 opacity-20 bg-[radial-gradient(120%_100%_at_50%_0%,white,transparent_60%)]" />
                <RefreshCcw className={`relative w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? 'Processing...' : `Recover ${recoverableAmount} SOL`}
              </GradientButton>
            ) : (
              <div className="w-full mt-2 bg-[#23263a] text-white/60 font-semibold text-lg py-3 rounded-xl text-center">
                No unused ATAs found to recover
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center gap-3">
            <GradientButton
              variant="variant"
              className="px-6 py-2 rounded-xl text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 hover:border-white/25 transition-all flex items-center gap-2 shadow-[0_6px_20px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              onClick={fetchAccountData}
              disabled={isLoading}
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Analysis
            </GradientButton>
            <GradientButton
              variant="variant"
              disabled={isLoading}
              className="px-6 py-2 rounded-xl text-white/90 bg-gradient-to-r from-[#2dd4bf]/10 to-[#818cf8]/10 hover:from-[#2dd4bf]/20 hover:to-[#818cf8]/20 border border-white/10 transition-all flex items-center gap-2"
            >
              View details
            </GradientButton>
          </div>
        </div>
      )}

      {/* No wallet connected state */}
      {!publicKey && (
        <div className="text-center text-white/60 py-12">
          <div className="text-xl mb-4">Connect your wallet to analyze your token accounts</div>
        </div>
      )}
    </div>
  );
}