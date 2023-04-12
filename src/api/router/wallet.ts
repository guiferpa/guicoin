import crypto from 'crypto';
import express, {IRouter, Request, Response} from "express";
import Ajv from 'ajv';
import {Database} from 'sqlite3';
import HttpStatusCodes from 'http-status-codes';

import Blockchain, {Transaction, Wallet} from "../../blockchain";
import {connector, disconnector} from '../../db/conn';
import {getWalletByPassphrase, registerWallet} from '../../db/wallet';

interface CreateWalletRequest extends Request {
  body: {
    owner: string;
  };
}

const ajv = new Ajv();

const router: IRouter = express.Router();

const createWalletSchema = {
  type: "object",
  properties: {
    owner: {
      type: "string",
      minLength: 3
    }
  },
  required: ["owner"],
  additionalProperties: false
}

export const createWallet = async (req: CreateWalletRequest, res: Response) => {
  const validate = ajv.compile(createWalletSchema);
  if (!validate(req.body)) {
    res.status(HttpStatusCodes.BAD_REQUEST).json(validate.errors);
    return
  }

  try {
    const {owner} = req.body;

    const db: Database = await connector();

    const wallet: Wallet = new Wallet(owner);
    await wallet.generateKeyPair();

    const passphrase: string = crypto.randomBytes(64).toString('hex');

    await registerWallet(db, wallet, passphrase);

    await disconnector(db);

    res.status(HttpStatusCodes.CREATED).json({wallet, passphrase});
  } catch (err) {
    console.log(err);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

const createTransactionByWalletSchema = {
  type: "object",
  properties: {
    address: {
      type: "string"
    },
    amount: {
      type: "number"
    }
  },
  required: ["address", "amount"],
  additionalProperties: false
}

interface CreateTransactionRequest extends Request {
  body: {
    address: string; // Receiver wallet
    amount: number;
  }
}

export const createTransaction = (bc: Blockchain) => async (req: CreateTransactionRequest, res: Response) => {
  const validate = ajv.compile(createTransactionByWalletSchema);
  if (!validate(req.body)) {
    res.status(HttpStatusCodes.BAD_REQUEST).json(validate.errors);
    return
  }

  try {
    const {passphrase} = req.params;
    const {address, amount} = req.body;

    const db: Database = await connector();

    const wallet: Wallet = await getWalletByPassphrase(db, passphrase);

    const tx: Transaction = new Transaction(wallet.getPublicKey(), address as string, amount as number);
    tx.sign(wallet.getPrivateKey());

    bc.addTransaction(tx);

    res.status(HttpStatusCodes.CREATED).json(tx);
  } catch (err) {
    console.log(err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: (err as Error).message
    });
  }
}

export default function registerWalletRouter(bc: Blockchain): IRouter {
  router.post('/', createWallet);
  router.post('/:passphrase/transactions', createTransaction(bc));

  return router;
}
