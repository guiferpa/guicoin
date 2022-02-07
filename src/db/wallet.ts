import { Database } from 'sqlite3';

import { Wallet } from '../blockchain';

export const registerWallet = (db: Database, wallet: Wallet, passphrase: string): Promise<void> => new Promise((resolve, reject) => {
  db.serialize(() => {
    const createWalletTableSQL = 'CREATE TABLE IF NOT EXISTS Wallets (PrivateKey text, PublicKey text, Owner text, Passphrase text)'
    const insertWalletSQL = `INSERT INTO Wallets (PrivateKey, PublicKey, Owner, Passphrase) VALUES ("${wallet.getPrivateKey()}", "${wallet.getPublicKey()}", "${wallet.getOwner()}", "${passphrase}")`

    db.run(createWalletTableSQL)
      .run(insertWalletSQL, (err) => {
        if (err) return reject(err);
        console.log("Wallet registered correctly in Wallets table");
        resolve();
    });
  });
});

export const getWalletByPassphrase = (db: Database, passphrase: string): Promise<Wallet> => new Promise((resolve, reject) => {
  db.serialize(() => {
    const selectUniqueWalletSQL = "SELECT * FROM Wallets WHERE Passphrase = ?";
    db.get(selectUniqueWalletSQL, [passphrase], (err, row) => {
      if (err) return reject(err);
      resolve(new Wallet(row.Owner, row.PrivateKey, row.PublicKey));
    });
  });
});

export const listWallets = (db: Database): Promise<void> => new Promise((resolve, reject) => {
  db.serialize(() => {
    db.all("SELECT * FROM Wallets", (err, rows) => {
      if (err) return reject(err);
      console.log(rows);
      resolve();
    });
  });
});
