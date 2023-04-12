import APIProvider from "./api";
import Blockchain from "./blockchain";

const guicoin = new Blockchain();
const provider = new APIProvider(guicoin);

const server = provider.createServer();

const port: number = 3000;

server.listen(port, () => {
  console.log(`Running Blockchain's API on port: ${port}`);
});

