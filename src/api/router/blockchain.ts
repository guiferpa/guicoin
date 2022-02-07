import express, { IRouter, Request, Response } from 'express';

import Blockchain from '../../blockchain';

const router: IRouter = express.Router();

export const getBlockchain = (bc: Blockchain) => (_: Request, res: Response) => {
  res.json(bc);
}

export default function registerRouter(bc: Blockchain): IRouter {
  router.get('/', getBlockchain(bc));

  return router;
}
