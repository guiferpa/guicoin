# guicoin
It's a API to work with Blockchain with focus on cryptocurrency

> ⚠ This project has focus just for fun and study. Under any dircustance use it for production's behavior

## Get started

### Install dependencies
```bash
yarn
```

### Start project (Development mode)
```bash
yarn dev
```

### Release from transpilated source code (Production mode)

#### Transpile source code
```bash
yarn build
```

#### Start project
```
yarn start
```

## API's resources

### Blockchain entity resources

**Describe all blockchain**

```bash
curl --location 'localhost:3000/blockchain'
```

### Wallet entity resources

**Create a wallet**

```bash
curl --location 'localhost:3000/wallets' \
--header 'Content-Type: application/json' \
--data '{
    "owner": "<owner-name>"
}'
```

**Create a transaction to another wallet**

```bash
curl --location 'localhost:3000/wallets/<passphrase>/transactions' \
--header 'Content-Type: application/json' \
--data '{
    "address": "<target-wallet-address>",
    "amount": 10
}'
```
