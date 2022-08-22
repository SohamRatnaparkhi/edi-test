
import { TiktokClone } from "../target/types/tiktok_clone";

import anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import _ from 'lodash';
const { web3 } = anchor
const { SystemProgram } = web3
import assert from "assert";
const utf8 = anchor.utils.bytes.utf8;
const provider = anchor.Provider.env()


const defaultAccounts = {
  tokenProgram: TOKEN_PROGRAM_ID,
  systemProgram: SystemProgram.programId,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
}

// Configure the client to use the local cluster.
anchor.setProvider(provider);
const program = anchor.workspace.TiktokClone as Program<TiktokClone>;
let creatorKey = provider.wallet.publicKey;
let stateSigner;

const run =  async () => {
  [stateSigner] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('state')],
    program.programId
  );

  try{
    const stateInfo = await program.account.stateAccount.fetch(stateSigner);
    console.log(stateInfo);
  }
  catch{
    await program.rpc.createState({
      accounts: {
        state: stateSigner,
        authority: creatorKey,
        ...defaultAccounts
      },
    })

    const stateInfo = await program.account.stateAccount.fetch(stateSigner);
    console.log(stateInfo);
    assert(stateInfo.authority.toString() === creatorKey.toString(), "State Creator is Invalid");
  }
}

run();
