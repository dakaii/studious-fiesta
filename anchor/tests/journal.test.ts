import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Journal } from '../target/types/journal';
import { PublicKey, SystemProgram } from '@solana/web3.js';

describe('journal', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Journal as Program<Journal>;

  it('Creates a journal entry', async () => {
    const [journalEntryPda, _] = await PublicKey.findProgramAddress(
      [Buffer.from('My Title'), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .createJournalEntry('My Title', 'My Message')
      .accounts({
        owner: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.journalEntry.fetch(journalEntryPda);
    expect(account.title).toBe('My Title');
    expect(account.message).toBe('My Message');
  });
});