import Ajv from 'ajv';
import express, { IRouter, Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

import Blockchain from '../../blockchain';

const ajv = new Ajv();

const router: IRouter = express.Router();

export const getBlockchain = (bc: Blockchain) => (_: Request, res: Response) => {
  res.json(bc);
}

const mineBlockchainSchema = {
  type: "object",
  properties: {
    address: {
      type: "string"
    }
  }
}

interface MineBlockchainRequest {
  body: {
    address: string;
  }
}

export const mineBlockchain = (bc: Blockchain) => async (req: MineBlockchainRequest, res: Response) => {
  const validate = ajv.compile(mineBlockchainSchema);
  if (!validate(req.body)) {
    res.status(HttpStatusCodes.BAD_REQUEST).json(validate.errors);
    return
  }

  try {
    const {address} = req.body;

    bc.minePendingTransactions(address);

    res.status(HttpStatusCodes.OK).json({
      receiverPublicKey: address,
      miningReward: bc.miningReward
    });
  } catch(err) {
    console.log(err);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

export default function registerRouter(bc: Blockchain): IRouter {
  router.get('/', getBlockchain(bc));
  router.get('/mine', mineBlockchain(bc));

  return router;
}
