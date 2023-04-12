import express, { IRouter } from 'express';
import Blockchain from '../../blockchain';

import registerBlockchainRouter from './blockchain';
import registerWalletRouter from './wallet';

const router: IRouter = express.Router();

export function registerRouter(bc: Blockchain): IRouter {
  router.use('/blockchain', registerBlockchainRouter(bc));
  router.use('/wallets', registerWalletRouter(bc));

  return router;
}
