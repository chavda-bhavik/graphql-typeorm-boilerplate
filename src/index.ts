import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createConnection, getConnectionOptions } from 'typeorm';
import cookieParser from 'cookie-parser';

import { createSchema } from './util/createSchema';
import { __prod__ } from './constants';

const main = async () => {
    const PORT = process.env.PORT || 4000;
    const options = await getConnectionOptions(process.env.NODE_ENV || 'development');

    await createConnection({ ...options, name: 'default' });
    const app = express();
    app.set('trust proxy', 1);
    app.use(
        cors({
            origin: [
                'http://localhost:3000',
                'https://studio.apollographql.com',
                process.env.client_url!,
            ],
            credentials: true,
        }),
    );
    app.use(cookieParser());
    const apolloServer = new ApolloServer({
        schema: await createSchema(),
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });
    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

main().catch((err) => {
    console.log(err);
});
