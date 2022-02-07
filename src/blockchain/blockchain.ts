import Block from './block';
import Transaction from './transaction';

class Blockchain {
  private chain: Block[];
  private difficulty: number = 2;
  private pendingTransactions: Transaction[] = [];
  private miningReward: number = 100;

  constructor() {
    const genesisBlock: Block = this.createGenesisBlock();
    this.chain = [genesisBlock];
  }

  private createGenesisBlock(): Block {
    const block: Block = new Block([], Date.now());
    block.setHash(block.calculateHash());
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
