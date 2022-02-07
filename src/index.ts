import Blockchain, { Wallet } from "./blockchain";

(async function () {
  const guicoin = new Blockchain();

  const guiferpa: Wallet = new Wallet("guiferpa");

  const nana: Wallet = new Wallet("nana");

  guicoin.minePendingTransactions(guiferpa.getPublicKey());

  guicoin.minePendingTransactions(guiferpa.getPublicKey());

  guicoin.addTransaction(guiferpa.createSignedTransaction(100, nana.getPublicKey()));

  console.log(guicoin.getBalanceByPublicKey(guiferpa.getPublicKey()));

  // console.log(JSON.stringify(guicoin, null, 4));
})();
