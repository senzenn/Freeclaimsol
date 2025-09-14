import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/actions/solanaConfig';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, createCloseAccountInstruction } from '@solana/spl-token';
import {  LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { parseTokenAccountResp } from '@raydium-io/raydium-sdk-v2';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';



const MAX_LEN = 14;
const platformFeePercentage = 0.15;



const closeAta = (tokenAta: string, user: PublicKey, programId:PublicKey) => {
  const closeInstruction = createCloseAccountInstruction(
    new PublicKey(tokenAta), // token account which you want to close
    user, // destination where sol money will go
    user,  // token account owner
    [],
    programId
  );

  return closeInstruction;
}

export async function POST(req: NextRequest) {
  try {
    const { publicKey } = await req.json();
    if (!publicKey) {
      return NextResponse.json({ error: 'Missing publicKey' }, { status: 400 });
    }

    console.log("here is the pubkey!!", publicKey)
    const owner = new PublicKey(publicKey);
    const tokenAccountResp = await connection.getTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });
    const token2022Req = await connection.getTokenAccountsByOwner(owner, { programId: TOKEN_2022_PROGRAM_ID });

    const tokenAccountData = parseTokenAccountResp({
      owner,
      tokenAccountResp: {
        context: tokenAccountResp.context,
        value: [...tokenAccountResp.value, ...token2022Req.value],
      },
    });

    const emptyaccounts = tokenAccountData.tokenAccounts.filter((acc) => Number(acc.amount.toString()) === 0)
    let max_len_account = null;
    
    if(emptyaccounts.length > MAX_LEN){
       max_len_account = emptyaccounts.slice(0,MAX_LEN);
    }
    let closeInstructions: TransactionInstruction[] = [];
    let closeLamports = 0;
    let totalamports = 0;

   
    for(let acc of max_len_account || emptyaccounts){

      if (acc.publicKey && acc.isAssociated) {
        const itx = closeAta(acc.publicKey?.toBase58(), owner, acc.programId);
        closeInstructions.push(itx);

        const solBalance = await connection.getBalance(acc.publicKey);
        console.log("SOL balance",solBalance/LAMPORTS_PER_SOL);
        console.log("here is sol balance---", solBalance);
        closeLamports+=solBalance;
      }
      
    }

    if(max_len_account){
  for(let acc of emptyaccounts){

      if (acc.publicKey && acc.isAssociated) {
        const solBalance = await connection.getBalance(acc.publicKey);
        console.log("here is sol balance---", solBalance);
        totalamports+=solBalance;
      }
      
    }
    }



    console.log("empty accounts", emptyaccounts.length);

       if(max_len_account){
        console.log("here is max len account--",max_len_account.length)
       }


     
    const serializedInstructions = closeInstructions.map(instruction => ({
      keys: instruction.keys.map(key => ({
        pubkey: key.pubkey.toBase58(),
        isSigner: key.isSigner,
        isWritable: key.isWritable,
      })),
      programId: instruction.programId.toBase58(),
      data: Array.from(instruction.data),
    }));

   
    // calculating 20 percent of fee that platform will charge on total atas recovver amount


    const platformFeeLamports = Math.floor(closeLamports * platformFeePercentage);
    const userReceiveLamports = closeLamports - platformFeeLamports;
    totalamports-platformFeeLamports;



    return NextResponse.json({ 
      tokenAccountData,
      closeInstructions: serializedInstructions,
      emptyAccountsCount: emptyaccounts.length,
      totalatas: tokenAccountData.tokenAccounts.length,
      usdrecieve: (userReceiveLamports/LAMPORTS_PER_SOL).toFixed(5),
      max_len_account: max_len_account ? max_len_account.length : null,
      platformFeeLamports: platformFeeLamports,
      totalamports: (totalamports/LAMPORTS_PER_SOL).toFixed(5)
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}


