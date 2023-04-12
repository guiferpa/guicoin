import express, { Application } from 'express';

import Blockchain from '../blockchain';
import { registerRouter } from './router';
 
export default class APIProvider {
  private _blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this._blockchain = blockchain;
  }

  public createServer(): Application {
    const app: Application = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(registerRouter(this._blockchain));

    return app;
  }
}

