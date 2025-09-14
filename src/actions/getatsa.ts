// "use server"
// import {  TxVersion, parseTokenAccountResp } from '@raydium-io/raydium-sdk-v2'
// import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js'
// import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, closeAccount, createCloseAccountInstruction, getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token'
// import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'

// import { connection, userWallet, burnerWallet } from './solanaConfig';

// export const fetchTokenAccountData = async (owner:PublicKey) => {

//     console
// //   const solAccountResp = await connection.getAccountInfo(owner)
//   const tokenAccountResp = await connection.getTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID })
//   const token2022Req = await connection.getTokenAccountsByOwner(owner, { programId: TOKEN_2022_PROGRAM_ID })
//   const tokenAccountData = parseTokenAccountResp({
//     owner: owner,
//     // solAccountResp,
//     tokenAccountResp: {
//       context: tokenAccountResp.context,
//       value: [...tokenAccountResp.value, ...token2022Req.value],
//     },
//   })



// //   const filteredAccount = tokenAccountData.tokenAccounts.filter((acc) => acc.amount.toString() === "0");


   

//   tokenAccountData.tokenAccounts.map(async(acc) => {
//     console.log(acc.publicKey?.toBase58())


//    if(acc.publicKey){
 
//     console.log(`${acc.mint.toBase58()} --->`,acc.amount.toString()/1000000 )

//     if(Number(acc.amount.toString()) === 0){
//         console.log("here is the accounttt", acc.publicKey.toBase58());


//     }


//    }
//   })

// //   return tokenAccountData

     


// }



// const closeAta = async(tokenAta: string) => {

//     const closeInstruction =  createCloseAccountInstruction(
//     new PublicKey(tokenAta), // token account which you want to close
//     userWallet.publicKey, // destination where sol money will go
//     userWallet.publicKey,  // token account owner
//   );

// try{
//   const txs = new Transaction().add(closeInstruction);
//   const {blockhash} = await connection.getLatestBlockhash();

//    txs.recentBlockhash = blockhash;
//    txs.feePayer = userWallet.publicKey;

// //    const simulation = await connection.simulateTransaction(txs);

//    const sign = await sendAndConfirmTransaction(connection,txs,[userWallet]);

//     console.log("here is simulation result-----", sign);
// }
// catch(e){
//    console.log("OOps something went wrong----->>>>", e)
// }

// }

// const burnToken = async(tokenAta:PublicKey, tokenAddress: PublicKey,amount:number) => {
    


//     console.log("hellooooo guyssss--------")
    
//  // get the token account of the toWallet Solana address, if it does not exist, create it
//    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
//     connection,
//     userWallet,
//     tokenAddress,
//     burnerWallet.publicKey
//    );


//   console.log("here is token ata ------->>>>>>>>>", toTokenAccount.address.toBase58());

//   try{
//     const transaction = new Transaction().add(
//     createTransferInstruction(
//       tokenAta,    // users token ata address
//       toTokenAccount.address, // burner token ata address
//       userWallet.publicKey, // owner = user pubkey
//       amount // numbers of tokens
//     )
//   );

//   const {blockhash} = await connection.getLatestBlockhash();
//   transaction.recentBlockhash = blockhash;
//   transaction.feePayer = userWallet.publicKey;


//   const simulation = await connection.simulateTransaction(transaction);
//   console.log("here is simulation result: -----", simulation);

//   const sign = await sendAndConfirmTransaction(connection, transaction, [userWallet]);

//   console.log("here is the signnnnn------", sign);
//   }
//   catch(e){
//     console.log("burning token failedd------>>>",e)
//   }

// }


// // fetchTokenAccountData(userWallet.publicKey);