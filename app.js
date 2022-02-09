#!/usr/bin/env node

'use strict';
const user = require('./user');
const token = require('./token');
const blockchain = require('./blockchain');
const api = require('./api');
const faker = require('faker');
const crypto = require('crypto');
const CatboxMemory = require('@hapi/catbox-memory');
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const {Client} = require('pg');
Client.poolSize = 100;

const settings = JSON.parse(fs.readFileSync(api.CONFIG_PATH, 'utf8'));
const ViewCacheExpirationInSeconds = 10;
const ViewGenerateTimeoutInSeconds = 30;

const init = async () => {
    const server = Hapi.server({
        port: settings.server_port,
        host: settings.server_host,
        cache: [
            {
                name: 'near-api-cache',
                provider: {
                    constructor: CatboxMemory
                }
            }
        ]
    });

    function processRequest(request) {
        Object.keys(request.payload).map((key) => {
            switch (request.payload[key]) {
                case '{username}':
                    request.payload[key] = faker.internet
                        .userName()
                        .replace(/[^0-9a-z]/gi, '');
                    break;
                case '{color}':
                    request.payload[key] = faker.internet.color();
                    break;
                case '{number}':
                    request.payload[key] = faker.random.number();
                    break;
                case '{word}':
                    request.payload[key] = faker.random.word();
                    break;
                case '{words}':
                    request.payload[key] = faker.random.words();
                    break;
                case '{image}':
                    request.payload[key] = faker.random.image();
                    break;
            }
        });

        return request;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return api.notify(
                'Welcome to NEAR REST API SERVER (https://github.com/near-examples/near-api-rest-server)! ' +
                (!settings.master_account_id
                    ? 'Please initialize your NEAR account in order to use simple nft mint/transfer methods'
                    : `Master Account: ${settings.master_account_id}`)
            );
        },
    });

    server.route({
        method: 'POST',
        path: '/view',
        handler: async (request, h) => {
            request = processRequest(request);

            if (request.payload.disabled_cache) {
                return blockchain.View(
                    request.payload.contract,
                    request.payload.method,
                    request.payload.params,
                    request.payload.rpc_node,
                    request.payload.headers
                );
            } else {
                request.payload.request_name = "view";
                return replyCachedValue(h, await server.methods.view(request.payload));
            }
        }
    });

    server.method(
        'view',
        async (params) => blockchain.View(
            params.contract,
            params.method,
            params.params,
            params.rpc_node,
            params.headers
        ),
        getServerMethodParams());

    server.route({
        method: 'POST',
        path: '/call',
        handler: async (request) => {
            request = processRequest(request);
            let {
                account_id,
                private_key,
                attached_tokens,
                attached_gas,
                contract,
                method,
                params,
                network,
                rpc_node,
                headers
            } = request.payload;
            return await blockchain.Call(
                account_id,
                private_key,
                attached_tokens,
                attached_gas,
                contract,
                method,
                params,
                network,
                rpc_node,
                headers
            );
        },
    });

    server.route({
        method: 'POST',
        path: '/init',
        handler: async (request) => {
            if (settings.init_disabled) {
                return api.reject('Method now allowed');
            }

            request = processRequest(request);
            let {
                master_account_id,
                seed_phrase,
                private_key,
                nft_contract,
                server_host,
                server_port,
                rpc_node,
            } = request.payload;

            if (seed_phrase)
                private_key = (await user.GetKeysFromSeedPhrase(seed_phrase)).secretKey;

            let response = await blockchain.Init(
                master_account_id,
                private_key,
                nft_contract,
                server_host,
                server_port,
                rpc_node
            );
            if (!response.error) {
                process.on('SIGINT', function () {
                    console.log('Stopping server...');
                    server.stop({timeout: 1000}).then(async function () {
                        await server.start();
                    });
                });
            }

            return response;
        },
    });

    server.route({
        method: 'POST',
        path: '/deploy',
        handler: async (request) => {
            request = processRequest(request);
            let {account_id, private_key, seed_phrase, contract} = request.payload;

            if (seed_phrase)
                private_key = (await user.GetKeysFromSeedPhrase(seed_phrase)).secretKey;

            return await blockchain.DeployContract(account_id, private_key, contract);
        },
    });

    server.route({
        method: 'GET',
        path: '/view_nft/{token_id}',
        handler: async (request, h) => {
            request.params.request_name = "view_nft";
            return replyCachedValue(h, await server.methods.viewNFT(request.params));
        },
    });

    server.method(
        'viewNFT',
        async (params) => await token.ViewNFT(params.token_id),
        getServerMethodParams());

    server.route({
        method: 'POST',
        path: '/view_nft',
        handler: async (request) => {
            return await token.ViewNFT(
                request.payload.token_id,
                request.payload.contract
            );
        },
    });

    server.route({
        method: 'POST',
        path: '/create_user',
        handler: async (request) => {
            request = processRequest(request);

            const name = (
                request.payload.name +
                '.' +
                settings.master_account_id
            ).toLowerCase();
            let account = await user.CreateKeyPair(name);

            let status = await user.CreateAccount(account);

            if (status)
                return {
                    text: `Account ${name} created. Public key: ${account.public_key}`,
                };
            else return {text: 'Error'};
        },
    });

    server.route({
        method: 'POST',
        path: '/parse_seed_phrase',
        handler: async (request) => {
            request = processRequest(request);

            return await user.GetKeysFromSeedPhrase(request.payload.seed_phrase);
        },
    });

    server.route({
        method: 'GET',
        path: '/balance/{account_id}',
        handler: async (request) => {
            return await blockchain.GetBalance(request.params.account_id);
        }
    });

    server.route({
        method: 'GET',
        path: '/keypair',
        handler: async () => {
            return await user.GenerateKeyPair();
        }
    });

    server.route({
        method: 'POST',
        path: '/mint_nft',
        handler: async (request) => {
            let {min, max} = request.payload;

            if (!min || !max) min = max = 0;
            let response = [];

            request = processRequest(request);
            for (let i = min; i <= max; i++) {
                const tokenId = request.payload.token_id.replace('{inc}', i);

                let {account_id, private_key, token_metadata, contract} = request.payload;

                const tx = await token.MintNFT(
                    tokenId,
                    token_metadata,
                    contract,
                    account_id,
                    private_key
                );

                if (tx) {
                    if (min === max) {
                        let create_token = await token.ViewNFT(tokenId, contract);
                        create_token.token_id = tokenId;
                        response.push({token: create_token, tx: tx});
                    } else {
                        response.push({tx: tx});
                    }
                } else {
                    response.push({text: 'Error. Check backend logs.'});
                }
            }

            return response;
        },
    });

    server.route({
        method: 'POST',
        path: '/transfer_nft',
        handler: async (request) => {
            request = processRequest(request);

            let {
                token_id,
                receiver_id,
                enforce_owner_id,
                memo,
                contract,
                owner_private_key,
            } = request.payload;

            const txStatus = await token.TransferNFT(
                token_id,
                receiver_id,
                enforce_owner_id,
                memo,
                contract,
                owner_private_key
            );

            if (txStatus.error) {
                return txStatus;
            } else if (txStatus.status.Failure) {
                return {
                    error:
                        'Because of some reason transaction was not applied as expected',
                };
            } else {
                const new_token = await token.ViewNFT(token_id, contract);
                if (!new_token) return api.reject('Token not found');

                new_token.tx = txStatus.transaction.hash;
                return new_token;
            }
        },
    });

    server.route({
        method: 'GET',
        path: '/about',
        handler: async () => {
            const json = require('./package.json');
            return "NEAR REST API SERVER Ver. " + json.version;
        }
    });

    server.route({
        method: 'POST',
        path: '/explorer',
        handler: async (request) => {
            let {
                user,
                host,
                database,
                password,
                port,
                query,
                parameters
            } = request.payload;

            const client = new Client({
                user,
                host,
                database,
                password,
                port,
            });

            if (["104.199.89.51", "35.184.214.98"].includes(host)) {
                return api.reject('Please run explorer function only on your own NEAR REST API SERVER instance, https://github.com/near-examples/near-api-rest-server');
            }

            try {
                client.connect();
                let response = await client.query(query, parameters);
                return response.rows;
            } catch (ex) {
                return api.reject('Error. ' + ex.message);
            }
        },
    });

    server.route({
        method: 'POST',
        path: '/sign_url',
        handler: async (request) => {
            let {
                account_id,
                method,
                params,
                deposit,
                gas,
                receiver_id,
                meta,
                callback_url,
                network
            } = request.payload;

            return blockchain.GetSignUrl(
                account_id,
                method,
                params,
                deposit,
                gas,
                receiver_id,
                meta,
                callback_url,
                network
            );
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

const getServerMethodParams = () => {
    return {
        generateKey: (params) => {
            let hash = crypto.createHash('sha1');
            hash.update(JSON.stringify(params));
            return hash.digest('base64');
        },
        cache: {
            cache: 'near-api-cache',
            expiresIn: ViewCacheExpirationInSeconds * 1000,
            generateTimeout: ViewGenerateTimeoutInSeconds * 1000,
            getDecoratedValue: true
        }
    }
};

const replyCachedValue = (h, {value, cached}) => {
    const lastModified = cached ? new Date(cached.stored) : new Date();
    return h.response(value).header('Last-Modified', lastModified.toUTCString());
};

init();
