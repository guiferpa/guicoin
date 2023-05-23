import APIProvider from "./api";
import Blockchain from "./blockchain";

const run  = async () => {
  const guicoin = new Blockchain();
  await guicoin.generateGenesisBlock();

  const provider = new APIProvider(guicoin);

  const server = provider.createServer();

  const port: number = 3000;

  server.listen(port, () => {
    console.log(`Running Blockchain's API on port: ${port}`);
  });
}

run().catch(console.error);
