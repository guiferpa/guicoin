import crypto, { ECKeyPairOptions } from 'crypto';
import { promisify } from 'util';

import Transaction from './transaction';

export default class Wallet {
  constructor(
    private readonly owner: string,
    private privateKey: string = "",
    private publicKey: string = ""
  ) {}

  public getOwner(): string {
    return this.owner;
  }

  public getPrivateKey(): string {
    return this.privateKey;    
  }

  public getPublicKey(): string {
    return this.publicKey;
  }

  public createSignedTransaction(amount: number, receiverPublicKey: string): Transaction {
    const tx: Transaction = new Transaction(this.publicKey, receiverPublicKey, amount);
    tx.sign(this.privateKey);
    
    return tx;
  }

  public async generateKeyPair(): Promise<void> {
    const options: ECKeyPairOptions<"der", "der"> = {
      namedCurve: "secp256k1",
      publicKeyEncoding: {
        type: "spki",
        format: "der"
      },
      privateKeyEncoding: {
        type: "sec1",
        format: "der"
      }
    }
    const { privateKey, publicKey } = await promisify(crypto.generateKeyPair)("ec", options);
    this.privateKey = privateKey.toString('hex');
    this.publicKey = publicKey.toString('hex');
  }
}
