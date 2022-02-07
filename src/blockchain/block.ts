import crypto, { Hash } from 'crypto';

import Transaction from "./transaction";

class Block {
  private hash: string = "";
  private previousHash: string = "";
  private nonce: number = 0;

  constructor(
    private readonly transactions: Transaction[],
    private readonly timestemp: number
  ) {}

  public setHash(hash: string): void {
    this.hash = hash;
  }

  public getHash(): string {
    return this.hash;
  }

  public setPreviousHash(hash: string): void {
    this.previousHash = hash;
  }

  public getPreviousHash(): string {
    return this.previousHash;
  }

  public calculateHash(): string {
    const payload: string = `${this.previousHash}::${this.timestemp}::${JSON.stringify(this.transactions)}::${this.nonce}`;
    const encrypted: Hash = crypto.createHash("sha256");
    return encrypted.update(payload).digest().toString('hex');
  }

  public mineBlock(difficulty: number) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce += 1;
      this.hash = this.calculateHash();
    }
    console.log(`Hash mined: ${this.hash}`);
  }

  public getTransactionsByPublicKey(publicKey: string): Transaction[] {
    return this.transactions.filter((tx) => {
      return (tx.getReceiver() === publicKey || tx.getSender() === publicKey);
    });
  }
}

export default Block;
