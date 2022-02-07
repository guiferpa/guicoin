import path from 'path';
import { Database } from 'sqlite3';

export const connector = (filename: string = "db"): Promise<Database> => new Promise((resolve, reject) => {
  const db: Database = new  Database(path.resolve(__dirname, `./${filename}.sqlite3`), (err) => {
    if (!err) resolve(db); 

    reject(err);
  });
});

export const disconnector = (db: Database): Promise<void> => new Promise((resolve, reject) => {
  db.close((err) => {
    if(err) return reject(err);
    resolve();
  });
});
