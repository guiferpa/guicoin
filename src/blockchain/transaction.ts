import crypto, { Hash } from 'crypto';

class Transaction {
  private signature: string = "";

  constructor(
    private readonly senderPublicKey: string,
    private readonly receiverPublicKey: string,
    private readonly amount: number
  ) {}

  public getSender(): string {
    return this.senderPublicKey;
  }

  public getReceiver(): string {
    return this.receiverPublicKey;
  }

  public getAmount(): number {
    return this.amount;
  }

  public calculateHash(): string {
    const payload: string = `${this.senderPublicKey}::${this.receiverPublicKey}::${this.amount}`;
    const encrypted: Hash = crypto.createHash("SHA256");
    return encrypted.update(payload).digest().toString('hex');
  }

  public sign(senderPrivateKey: string): void {
    const hash: string = this.calculateHash();
    const sign = crypto.createSign("SHA256").update(Buffer.from(hash, 'hex')).end();
    this.signature = sign.sign({ key: Buffer.from(senderPrivateKey, 'hex'), format: 'der', type: 'sec1' }).toString('hex');
  }

  public isValidSignature(): boolean {
    if (!this.senderPublicKey) return true;
    if (!this.signature) throw new Error("No signature in this transaction");

    const verify = crypto.createVerify("SHA256").update(Buffer.from(this.calculateHash(), 'hex'));
    return verify.verify({ key: Buffer.from(this.senderPublicKey, 'hex'), format: 'der', type: 'spki' }, Buffer.from(this.signature, 'hex'));
  }
}

export default Transaction;
