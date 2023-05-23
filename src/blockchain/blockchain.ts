import crypto from 'crypto';

import {Database} from 'sqlite3';
import {connector, disconnector} from '../db/conn';
import {registerWallet} from '../db/wallet';
import Block from './block';
import Transaction from './transaction';
import Wallet from './wallet';

class Blockchain {
  private chain: Block[] = [];
  private difficulty: number = 2;
  private pendingTransactions: Transaction[] = [];
  public miningReward: number = 100;

  public async generateGenesisBlock(): Promise<Block> {
    const empt = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    const wallet = new Wallet(empt);
    await wallet.generateKeyPair();

    const tx = new Transaction(empt, wallet.getPublicKey(), this.miningReward);
    const block: Block = new Block([tx], Date.now());

    const db: Database = await connector();

    await wallet.generateKeyPair();

    const passphrase: string = crypto.randomBytes(64).toString('hex');

    await registerWallet(db, wallet, passphrase);

    await disconnector(db);

    block.setHash(block.calculateHash());
    this.chain = [block];
    
    console.log(`
  [Initial wallet created]
    Private key: 
      ${wallet.getPrivateKey()}
    Public key: 
      ${wallet.getPublicKey()}
    Passphrase: 
      ${passphrase}
`);

    return block;
  }

  public getLastestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public minePendingTransactions(miningRewardPublicKey: string): void {
    const block: Block = new Block(this.pendingTransactions, Date.now());
    block.mineBlock(this.difficulty);

    this.chain = [...this.chain, block];

    this.pendingTransactions = [
      new Transaction("", miningRewardPublicKey, this.miningReward)
    ];
  }

  public addTransaction(transaction: Transaction): void {
    if (!transaction.isValidSignature()) throw new Error("You cannot add an invalid transaction");

    if (transaction.getAmount() > this.getBalanceByPublicKey(transaction.getSender())) throw new Error("You don't have enough balance");

    this.pendingTransactions = [...this.pendingTransactions, transaction];
  }

  public getBalanceByPublicKey(publicKey: string): number {
    let balance: number = 0;

    for (const block of this.chain) {
      for (const transaction of block.getTransactionsByPublicKey(publicKey)) {
        balance += transaction.getSender() === publicKey ? -transaction.getAmount() : transaction.getAmount()
      }
    }

    for (const block of this.chain) {
      for (const transaction of block.getTransactionsByPublicKey(publicKey)) {
        balance += transaction.getSender() === publicKey ? -transaction.getAmount() : transaction.getAmount()
      }
    }

    return balance;
  }

  public isChainValid(): boolean {
    for (let index = 1; index < this.chain.length; index++) {
      const currentBlock: Block = this.chain[index];
      const previousBlock: Block = this.chain[index - 1];

      if (currentBlock.getHash() !== currentBlock.calculateHash()) {
        return false;
      }

      if (previousBlock.getHash() !== currentBlock.getPreviousHash()) {
        return false;
      }
    }

    return true;
  }
}

export default Blockchain;
