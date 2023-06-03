# NEAR REST API SERVER

> Interact with the NEAR blockchain using a simple REST API.

###### Live Demo:
* [REST API Endpoint for NEAR Testnet](https://rest.nearspace.info) 
* [Web Console for `view`/`call` requests](https://api.nearspace.info) 

---

## Overview

_Click on a route for more information and examples_

| Route                                      | Method | Description                                                                                                                 |
| ------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| **CONTRACTS**                              |        |                                                                                                                             |
| [`/deploy`](#deploy)                       | POST   | Deploys a smart contract on NEAR.                                                                                           |
| [`/view`](#view)                           | POST   | Performs a smart contract **view** call with no gas burnt.                                                                  |
| [`/call`](#call)                           | POST   | Performs a smart contract **change** call that burns gas.                                                                   |
|                                            |        |                                                                                                                             |
| **UTILS**                                  |        |                                                                                                                             |
| [`/init`](#init)                           | POST   | Initializes the master account and updates `near-api-server-config.json`                                                    |
| [`/create_user`](#create_user)             | POST   | Creates a NEAR [sub-account](https://docs.near.org/docs/concepts/account#subaccounts) and stores credentials in `/storage`. |
| [`/parse_seed_phrase`](#parse_seed_phrase) | POST   | Displays public and private key pair from a given seed phrase.                                                              |
| [`/balance`](#balance)                     | GET    | Displays account balance.                                                                                                   |
| [`/keypair`](#keypair)                     | GET    | Generates Ed25519 key pair.                                                                                                 |
| [`/explorer`](#explorer)                   | POST   | Run SELECT query in NEAR explorer database.                                                                                 |
|                                            |        |                                                                                                                             |
| **NFT EXAMPLE**                            |        |                                                                                                                             |
| [`/mint_nft`](#mint_nft)                   | POST   | Mints an NFT for a given contract.                                                                                          |
| [`/transfer_nft`](#transfer_nft)           | POST   | Transfers NFT ownership to a specified account.                                                                             |
| [`/view_nft`](#view_nft)                   | POST   | Returns owner, metadata, and approved account IDs for a given token ID.                                                     |

---

## Requirements

- [NEAR Account](https://docs.near.org/concepts/basics/account) _(with access to private key or seed phrase)_
- [Node.js](https://nodejs.org/en/download/package-manager/)
- [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/getting-started/install)
- API request tool such as [Postman](https://www.postman.com/downloads/)

---

## Setup

1. Clone repository

```bash
git clone git@github.com:near-examples/near-api-server.git
```

2. Install dependencies

```bash
npm install
```

3. Configure `near-api-server.config.json`

Default settings:

```json
{
  "server_host": "localhost",
  "server_port": 3000,
  "rpc_node": "https://rpc.testnet.near.org",
  "init_disabled": true
}
```

_**Note:** `init_disabled` determines if params can be changed via `/init` route._

4. Start server

```bash
node app
```

---

# Contracts

## `/deploy`

> _Deploys a smart contract to the NEAR blockchain based on the wasm file located in `/contracts` folder._

**Method:** **`POST`**

| Param                            | Description                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `account_id`                     | _Account id that you will be deploying the contract to._                             |
| `seed_phrase` _OR_ `private_key` | _Seed phrase OR private key of the account id above._                                |
| `contract`                       | _wasm file of compiled contract located in the `/contracts` folder of this project._ |

_**Note:** Use [`near login`](https://docs.near.org/tools/near-cli#near-login) to save your key pair to your local machine._

Example:

```json
{
  "account_id": "example.testnet",
  "seed_phrase": "witch collapse practice feed shame open despair creek road again ice least",
  "contract": "nft_simple.wasm"
}
```

<details>
<summary><strong>Example Response:</strong> </summary>
<p>

```json
{
  "status": {
    "SuccessValue": ""
  },
  "transaction": {
    "signer_id": "example.testnet",
    "public_key": "ed25519:Cgg4i7ciid8uG4K5Vnjzy5N4PXLst5aeH9ApRAUA3y8U",
    "nonce": 5,
    "receiver_id": "example.testnet",
    "actions": [
      {
        "DeployContract": {
          "code": "hT9saWV3aok50F8JundSIWAW+lxOcBOns1zenB2fB4E="
        }
      }
    ],
    "signature": "ed25519:3VrppDV8zMMRXErdBJVU9MMbbKZ4SK1pBZqXoyw3oSSiXTeyR2W7upNhhZPdFJ1tNBr9h9SnsTVeBm5W9Bhaemis",
    "hash": "HbokHoCGcjGQZrz8yU8QDqBeAm5BN8iPjaSMXu7Yp2KY"
  },
  "transaction_outcome": {
    "proof": [
      {
        "hash": "Dfjn2ro1dXrPqgzd5zU7eJpCMKnATm295ceocX73Qiqn",
        "direction": "Right"
      },
      {
        "hash": "9raAgMrEmLpL6uiynMAi9rykJrXPEZN4WSxLJUJXbipY",
        "direction": "Right"
      }
    ],
    "block_hash": "B64cQPDNkwiCcN3SGXU2U5Jz5M9EKF1hC6uDi4S15Fb3",
    "id": "HbokHoCGcjGQZrz8yU8QDqBeAm5BN8iPjaSMXu7Yp2KY",
    "outcome": {
      "logs": [],
      "receipt_ids": ["D94GcZVXE2WgPGuaJPJq8MdeEUidrN1FPkuU75NXWm7X"],
      "gas_burnt": 1733951676474,
      "tokens_burnt": "173395167647400000000",
      "executor_id": "example.testnet",
      "status": {
        "SuccessReceiptId": "D94GcZVXE2WgPGuaJPJq8MdeEUidrN1FPkuU75NXWm7X"
      }
    }
  },
  "receipts_outcome": [
    {
      "proof": [
        {
          "hash": "3HLkv7KrQ9LPptX658QiwkFagv8NwjcxF6ti15Een4uh",
          "direction": "Left"
        },
        {
          "hash": "9raAgMrEmLpL6uiynMAi9rykJrXPEZN4WSxLJUJXbipY",
          "direction": "Right"
        }
      ],
      "block_hash": "B64cQPDNkwiCcN3SGXU2U5Jz5M9EKF1hC6uDi4S15Fb3",
      "id": "D94GcZVXE2WgPGuaJPJq8MdeEUidrN1FPkuU75NXWm7X",
      "outcome": {
        "logs": [],
        "receipt_ids": [],
        "gas_burnt": 1733951676474,
        "tokens_burnt": "173395167647400000000",
        "executor_id": "example.testnet",
        "status": {
          "SuccessValue": ""
        }
      }
    }
  ]
}
```

</p>
</details>

---

## `/view`

> _Performs a smart contract view call that is free of charge (no gas burnt)._

**Method:** **`POST`**

| Param      | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| `contract` | _Account id of the smart contract you are calling._                                       |
| `method`   | _Name of the public method on the contract you are calling._                              |
| `params`   | _Arguments the method of the contract takes. Pass an empty object if no args are needed._ |

Example:

```json
{
  "contract": "inotel.pool.f863973.m0",
  "method": "get_accounts",
  "params": { "from_index": 0, "limit": 5 }
}
```

<details>
<summary><strong>Example Response:</strong> </summary>
<p>

```json
[
  {
    "account_id": "ino.lockup.m0",
    "unstaked_balance": "0",
    "staked_balance": "2719843984800963837328608365424",
    "can_withdraw": true
  },
  {
    "account_id": "ino.testnet",
    "unstaked_balance": "2",
    "staked_balance": "3044983795632859169857527919579",
    "can_withdraw": true
  },
  {
    "account_id": "ino.stakewars.testnet",
    "unstaked_balance": "2",
    "staked_balance": "21704174266817478470830456026",
    "can_withdraw": true
  },
  {
    "account_id": "ds4.testnet",
    "unstaked_balance": "3",
    "staked_balance": "10891355794195012441764921",
    "can_withdraw": true
  },
  {
    "account_id": "32oijafsiodjfas.testnet",
    "unstaked_balance": "3",
    "staked_balance": "383757424103247547511904666",
    "can_withdraw": true
  }
]
```

</p>
</details>

---

## `/call`

> _Performs a smart contract call that changes state and burns gas._

**Method:** **`POST`**

| Param                            | Description                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `account_id`                     | _Account id that will be performing the call and will be charged for gas and attached tokens / deposit._              |
| `seed_phrase` _OR_ `private_key` | _Seed phrase OR private key of the account id above._                                                                 |
| `contract`                       | _Account id of the smart contract you will be calling._                                                               |
| `method`                         | _Public method on the smart contract that you will be calling._                                                       |
| `params`                         | _Arguments the method of the contract takes. Pass an empty object if no args are needed._                             |
| `attached_gas`                   | _Amount of gas you will be attaching to the call in [TGas](https://docs.near.org/docs/concepts/gas#thinking-in-gas)._ |
| `attached_tokens`                | _Amount of tokens to be sent to the contract you are calling in yoctoNEAR (10^-24 NEAR)._                             |

_**Note:** Use [`near login`](https://docs.near.org/docs/tools/near-cli#near-login) to save your key pair to your local machine._

Example:

```json
{
  "account_id": "example.testnet",
  "private_key": "2Kh6PJjxH5PTTsVnYqtgnnwXHeafvVGczDXoCb33ws8reyq8J4oBYix1KP2ugRQ7q9NQUyPcVFTtbSG3ARVKETfK",
  "contract": "guest-book.testnet",
  "method": "addMessage",
  "params": { "text": "Hello World" },
  "attached_gas": "100000000000000",
  "attached_tokens": "0"
}
```


<details>
<summary><strong>Example Response:</strong> </summary>
<p>

```json
{
  "status": {
    "SuccessValue": ""
  },
  "transaction": {
    "signer_id": "example.testnet",
    "public_key": "ed25519:ASZEids5Qa8XMHX2S7LRL4bQRczi4YuMWXSM7S1HE5b",
    "nonce": 4,
    "receiver_id": "guest-book.testnet",
    "actions": [
      {
        "FunctionCall": {
          "method_name": "addMessage",
          "args": "eyJ0ZXh0IjoiSGVsbG8gV29ybGQifQ==",
          "gas": 100000000000000,
          "deposit": "0"
        }
      }
    ],
    "signature": "ed25519:4T9FqsjYBxcitjd5GgHrv3i3hcdcJSNcwwG3jBUgs7zZCZ3uShAK44Hi3oYFefhr8e5UW3LLD49ofRpGXKwGqqot",
    "hash": "CniHtfQVzcyVWJaUrQibJyGdhLi5axsjsoSRvvFbJ1jv"
  },
  "transaction_outcome": {
    "proof": [
      {
        "hash": "EkzDGbbBHSAuJcCPmhKSqbnBKyLrMgXkrTEZZZQudHeH",
        "direction": "Right"
      },
      {
        "hash": "36j4PK6fsLChiVTBQnXS1ywVSgJgHo7FtWzd5y5jkK1B",
        "direction": "Right"
      }
    ],
    "block_hash": "CUAu2deED8UX4vkerCbsTMR7YkeKt8RQXknYMNrVvM7C",
    "id": "CniHtfQVzcyVWJaUrQibJyGdhLi5axsjsoSRvvFbJ1jv",
    "outcome": {
      "logs": [],
      "receipt_ids": ["B7xAYoga5vrKERK7wY7EHa2Z74LaRJwqPsh4esLrKeQF"],
      "gas_burnt": 2427992549888,
      "tokens_burnt": "242799254988800000000",
      "executor_id": "example.testnet",
      "status": {
        "SuccessReceiptId": "B7xAYoga5vrKERK7wY7EHa2Z74LaRJwqPsh4esLrKeQF"
      }
    }
  },
  "receipts_outcome": [
    {
      "proof": [
        {
          "hash": "6Uo6BajpAxiraJEv69RwhjYnC86u56cw29vRDB1SV4dv",
          "direction": "Right"
        }
      ],
      "block_hash": "Ecq6pK74uiJFKxPTaasYuQcsEznnQjdzMAfsyrBpDo2u",
      "id": "B7xAYoga5vrKERK7wY7EHa2Z74LaRJwqPsh4esLrKeQF",
      "outcome": {
        "logs": [],
        "receipt_ids": ["6S6m1TYuVPYovLu9FHGV5oLRnDXeNQ8NhXxYjcr91xAN"],
        "gas_burnt": 3766420707221,
        "tokens_burnt": "376642070722100000000",
        "executor_id": "guest-book.testnet",
        "status": {
          "SuccessValue": ""
        }
      }
    },
    {
      "proof": [
        {
          "hash": "2za2YKUhyMfWbeEL7UKZxZcQbAqEmSPgPoYh9QDdeJQi",
          "direction": "Left"
        },
        {
          "hash": "61aHEiTBBbPU8UEXgSQh42TujFkHXQQMSuTh13PLPwbG",
          "direction": "Right"
        }
      ],
      "block_hash": "6LfpzvCBkqq7h5uG9VjAHMwSpC3HMMBSAGNGhbrAJzKP",
      "id": "6S6m1TYuVPYovLu9FHGV5oLRnDXeNQ8NhXxYjcr91xAN",
      "outcome": {
        "logs": [],
        "receipt_ids": [],
        "gas_burnt": 0,
        "tokens_burnt": "0",
        "executor_id": "example.testnet",
        "status": {
          "SuccessValue": ""
        }
      }
    }
  ]
}
```

</p>
</details>

---

# Utils

---

## `/init`

> _Configures `near-api-server.config.json` and creates a master account that stores credentials in this file. This allows for "simple methods" to be called where you won't have to pass as many parameters, primarily the master account id and private key or seed phrase._

**ATTN: SERVER MUST BE RESTARTED AFTER CALLING THIS ENDPOINT**

**Method:** **`POST`**

| Param                            | Description                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `master_account_id`              | _Master account that has full access to the NFT contract below_                                                         |
| `seed_phrase` _OR_ `private_key` | _Seed phrase OR private key of the account id above._                                                                   |
| `nft_contract`                   | _Contract account that has NFT contract deployed to it_                                                                 |
| `server_host`                    | _Public IP address for your API server (localhost is default)_                                                          |
| `server_port`                    | _(Port your API server will listen on)_                                                                                 |
| `rpc_node`                       | _[Network](https://docs.near.org/docs/concepts/networks) your server will be running on (testnet, mainnet, or betanet)_ |

_**Note:** Use [`near login`](https://docs.near.org/docs/tools/near-cli#near-login) to save your key pair to your local machine._

Example:

```json
{
  "master_account_id": "example.testnet",
  "seed_phrase": "seed phrase for master_account_id goes here",
  "nft_contract": "nft-contract.example.testnet",
  "server_host": "localhost",
  "server_port": 3000,
  "rpc_node": "https://rpc.testnet.near.org"
}
```

Example Response:

```json
{
  "text": "Settings updated."
}
```

---

## `/sign_url`

> _Generates a link to NEAR Wallet with provided transaction details. May be used to redirect user to the wallet and perform a transaction without generation application-specific keys and granting access._

**Method:** **`POST`**

| Param                            | Description                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `account_id`                     | _Signer Account_                                                                                                        |
| `receiver_id`                    | _Recipient contract account, may be dApp contract or personal account_                                                  |
| `method`                         | _Contract method to call. Use `!transfer` to transfer NEAR tokens_                                                      |
| `params`                         | _Transaction arguments_                                                                                                 |
| `deposit`                        | _Attached deposit in NEAR_                                                                                              |
| `gas`                            | _Attached gas in yoctoNEAR_                                                                                             |
| `meta`                           | _Transaction meta. May be empty_                                                                                        |
| `callback_url`                   | _URL to redirect user after the transaction. May be empty_                                                              |
| `network`                        | _Your network: mainnet/testnet_                                                                                         |

Example:

```
{
	"account_id": "zavodil.testnet",
	"receiver_id": "inotel.pool.f863973.m0",
	"method": "ping",
	"params": {},
	"deposit": 0,
	"gas": 30000000000000,	
	"meta": "",
	"callback_url": "",
	"network": "testnet"
}
```

Example Response:

```
    https://wallet.testnet.near.org/sign?transactions=DwAAAHphdm9kaWwudGVzdG5ldADKei8CC%2BlhIM9GNPitr87eHXpqdnQsCdLD%2B0ADdTJbqwEAAAAAAAAAFgAAAGlub3RlbC5wb29sLmY4NjM5NzMubTCfZPsioMcZCQRg4Uy7rOu4ERg10QV9c415FuXE0VDRRAEAAAACBAAAAHBpbmcCAAAAe30A4FfrSBsAAAAAAAAAAAAAAAAAAAAAAAA%3D&callbackUrl=
```

Approving this url performed a transaction [143c9MNaqXFXuiobjUaQ8FPSBR2ukYbCMzGdPe6HqXEq](https://explorer.testnet.near.org/transactions/143c9MNaqXFXuiobjUaQ8FPSBR2ukYbCMzGdPe6HqXEq)


## `/create_user`

> _Creates a NEAR [sub-account](https://docs.near.org/docs/concepts/account#subaccounts) using initialized master account and saves credentials to `/storage` directory. Requires [`/init`](#init) configuration with master account._

**Note:** _Only letters, digits, and - or \_ separators are allowed._

**Method:** **`POST`**

Example:

```
{
    "name" : "satoshi"
}
```

Example Response:

```json
{
  "text": "Account satoshi.example.testnet created. Public key: ed25519:HW4koiHqLi5WdVHWy9fqBWHbLRrzfmvCiRAUVhMa14T2"
}
```

---

## `/parse_seed_phrase`

> _Converts seed phrase into public / private key pair._

**Method:** **`POST`**

Example:

```
{
    "seed_phrase" : "witch collapse practice feed shame open despair creek road again ice least"
}
```

Example Response:

```
{
    "seedPhrase": "witch collapse practice feed shame open despair creek road again ice least",
    "secretKey": "ed25519:41oHMLtYygTsgwDzaMdjWRq48Sy9xJsitJGmMxgA9A7nvd65aT8vQwAvRdHi1nruPP47B6pNhW5T5TK8SsqCZmjn",
    "publicKey": "ed25519:Cgg4i7ciid8uG4K5Vnjzy5N4PXLst5aeH9ApRAUA3y8U"
}
```

---

## `/balance`

> _Displays account balance in yoctoNEAR (10^-24 NEAR)._

**Method:** **`GET`**

Example:

```
http://localhost:3000/balance/name.testnet
```

Example Response:

```
199999959035075000000000000
```

---

## `/keypair`

> _Generates Ed25519 key pair._

**Method:** **`GET`**

Example:

```
http://localhost:3000/keypair
```

Example Response:

```
{
  "public_key": "ed25519:3pNJK3fwP14UEbPjQqgDASwWR4XmbAEQBeNsyThhtNKY",
  "private_key": "3s9nVrCU4MER3w9cxXcJM58RGRzFNJnLzo9vgQiNrkuGW3Xp7Up6cYnY4JKQZ7Qp3GhmXckrApRyDPAfzo2oCm8a"
}
```

## `/explorer`

> _Run SELECT query in NEAR explorer database._

**Method:** **`POST`**

| Param                            | Description                                                 |
| -------------------------------- | ----------------------------------------------------------- |
| `user`                           | _Public account, `public_readonly`_                         |
| `host`                           | _NEAR indexer host, `testnet.db.explorer.indexer.near.dev`_ |
| `database`                       | _Name of the database, `testnet_explorer`_                  |
| `password`                       | _Password, `nearprotocol`_                                  |
| `port`                           | _Port, `5432`_                                              |
| `parameters`                     | _Array of query parameters, `[]`_                           |
| `query`                          | _Query without tabs, linebreaks and special characters_     |     

Check indexer server credentials on a [github](https://github.com/near/near-indexer-for-explorer/#shared-public-access). 

Example:

```json
{
  "user": "public_readonly",
  "host": "35.184.214.98",
  "database": "testnet_explorer",
  "password": "nearprotocol",
  "port": 5432,
  "parameters": ["testnet", 1],
  "query": "SELECT * FROM action_receipt_actions WHERE receipt_receiver_account_id = $1 LIMIT $2"
}
```

<details>
<summary><strong>Example Response:</strong> </summary>
<p>

```json
[
  {
    "receipt_id": "GZMyzjDWPJLjrCuQG82uHj3xRVHwdDnWHH1gCnSBejkR",
    "index_in_action_receipt": 0,
    "action_kind": "TRANSFER",
    "args": {
      "deposit": "1273665187500000000"
    },
    "receipt_predecessor_account_id": "system",
    "receipt_receiver_account_id": "testnet",
    "receipt_included_in_block_timestamp": "1619207391172257749"
  }
]
```

</p>
</details>

---

# NFTs

---

## `/mint_nft`

> _Mints a new NFT on a specified contract._

**Method:** **`POST`**

### Standard NFT Minting

| Param                            | Description                                            |
| -------------------------------- | ------------------------------------------------------ |
| `token_id`                       | _ID for new token you are minting_                     |
| `token_metadata`                 | _TokenMetadata for the new token as an object._        |
| `account_id`                     | _Account ID for the new token owner._                  |
| `seed_phrase` _OR_ `private_key` | _Seed phrase OR private key for the NFT contract._     |
| `nft_contract`                   | _Account ID for the NFT contract your are minting on._ |

_**Note:** Use [`near login`](https://docs.near.org/docs/tools/near-cli#near-login) to save your key pair to your local machine._

Example:

```
{
    "token_id": "EXAMPLE-TOKEN",
    "token_metadata": {"media":"https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu"},
    "account_id": "example.testnet",
    "private_key": "41oHMLtYygTsgwDzaMdjWRq48Sy9xJsitJGmMxgA9A7nvd65aT8vQwAvRdHi1nruPP47B6pNhW5T5TK8SsqCZmjn",
    "contract": "nft.example.near",
}
```

### Simple NFT Minting

_Requires [`/init`](#init) configuration with master account._

Example:

```json
{
  "token_id": "EXAMPLE_TOKEN",
  "metadata": "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu"
}
```

<details>
<summary><strong>Example Response:</strong> </summary>
<p>

```json
[
  {
    "token": {
      "owner_id": "example.testnet",
      "metadata": "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
      "approved_account_ids": [],
      "token_id": "EXAMPLE_TOKEN"
    },
    "tx": "Be7tV1h2dvhg53S2rartojeSUbNfQTB7ypuprmb6xRhw"
  }
]
```

</p>
</details>

_(`tx` is the transaction hash that can be queried in [NEAR Explorer](http://explorer.testnet.near.org))_

---

### Batch NFT minting (simple)

_Requires [`/init`](#init) configuration with master account._

Example:

```json
{
  "token_id": "EXAMPLE_TOKEN_{inc}",
  "metadata": "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
  "min": 31,
  "max": 33
}
```

_(This creates `EXAMPLE_TOKEN_31`, `EXAMPLE_TOKEN_32`, & `EXAMPLE_TOKEN_33`)_

<details>
<summary><strong>Example Response:</strong> </summary>
<p>

```json
[
  {
    "tx": "mAL92gb6g6hhubZBRewJk5vSwmmzm2SXmwdAfYqfWcG"
  },
  {
    "tx": "Dv9h8nWJLujkKpmw58ZR4QwAgPVprb4j5QarDUumoGEX"
  },
  {
    "tx": "J48F3vALJBbbUguKXp6e16g5vKVwzC2LtVBpsfEVFpYa"
  }
]
```

</p>
</details>

_(Above response are transaction hashes that can be queried in [NEAR Explorer](http://explorer.testnet.near.org))_

---

## `/transfer_nft`

> _Transfers ownership of NFT from specified contract on behalf of provided `enforce_owner_id` signed with `owner_private_key`._

**Method:** **`POST`**

### Standard Transfer NFT

| Param               | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `token_id`          | _Token ID of the token being transferred_                 |
| `receiver_id`       | _Account ID taking ownership of the NFT_                  |
| `enforce_owner_id`  | _Account ID for the account that currently owns the NFT._ |
| `memo`              | _Optional message to the new token holder._               |
| `owner_private_key` | _Private key of the `enforce_owner_id`._                  |
| `nft_contract`      | _NFT contract that the token being transferred is on._    |

_**Note:** Use [`near login`](https://docs.near.org/docs/tools/near-cli#near-login) to save your key pair to your local machine._

Example:

```json
{
  "token_id": "EXAMPLE-TOKEN",
  "receiver_id": "receiver.testnet",
  "enforce_owner_id": "example.testnet",
  "memo": "Here's a token I thought you might like! :)",
  "owner_private_key": "YOUR_PRIVATE_KEY",
  "contract": "nft.example.near"
}
```

Example Response:

```json
{
  "owner_id": "receiver.testnet",
  "metadata": "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
  "approved_account_ids": [],
  "tx": "5WdNgmNeA5UNpSMDRXemwJc95MB6J22LcvAaimuN5YzF"
}
```

_(`tx` is the transaction hash that can be queried in [NEAR Explorer](http://explorer.testnet.near.org))_

---

### Simple Transfer NFTs

> _Requires [`/init`](#init) configuration with master account._

| Param              | Description                                               |
| ------------------ | --------------------------------------------------------- |
| `token_id`         | _Token ID of the token being transferred_                 |
| `receiver_id`      | _Account ID taking ownership of the NFT_                  |
| `enforce_owner_id` | _Account ID for the account that currently owns the NFT._ |
| `memo`             | _Optional message to new token holder._                   |

Example:

```json
{
  "token_id": "EXAMPLE-TOKEN",
  "receiver_id": "receiver.testnet",
  "enforce_owner_id": "example.testnet",
  "memo": "Here's a token I thought you might like! :)"
}
```

Example Response:

```json
{
  "owner_id": "receiver.testnet",
  "metadata": "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
  "approved_account_ids": [],
  "tx": "5WdNgmNeA5UNpSMDRXemwJc95MB6J22LcvAaimuN5YzF"
}
```

_(`tx` is the transaction hash that can be queried in [NEAR Explorer](http://explorer.testnet.near.org))_

---

## `view_nft`

### Standard View NFT

> _Returns owner, metadata, and approved account IDs for a given token ID._

**Method:** **`POST`**

Example:

```json
{
  "token_id": "EXAMPLE-TOKEN",
  "contract": "nft.example.testnet"
}
```

Example response:

```json
{
  "owner_id": "example.testnet",
  "metadata": "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
  "approved_account_ids": []
}
```

---

### Simple View NFT

> _Receive detailed information about NFT using URL params. Requires [`/init`](#init) configuration with master account._

**Method:** **`GET`**

Example:

`http://localhost:3000/view_nft/EXAMPLE-TOKEN`

Example Response:

```json
{
  "owner_id": "example.testnet",
  "metadata": "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
  "approved_account_ids": []
}
```

---

## Faker data

> Use the following tags below to use random data for testing purposes.

- `{username}`
- `{number}`
- `{word}`
- `{words}`
- `{image}`
- `{color}`

## Video Presentation

[![Live App Review 15 - NFT Server Side API](https://img.youtube.com/vi/d71OscmH4cA/0.jpg)](https://youtu.be/d71OscmH4cA)
