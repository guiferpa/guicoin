import express, { Application } from 'express';

import Blockchain from '../blockchain';
import registerRouter from './router';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const guicoin = new Blockchain();

app.use(registerRouter(guicoin));

const port: number = 3000;

app.listen(port, () => {
  console.log("Running Blockchain...");
});
