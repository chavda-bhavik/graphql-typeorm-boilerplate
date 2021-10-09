import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createConnection, getConnectionOptions } from 'typeorm';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
// var MemoryStore = session.MemoryStore;

import { createSchema } from './util/createSchema';
import { __prod__ } from './constants';

const main = async () => {
    const PORT = process.env.PORT || 4000;
    const options = await getConnectionOptions(process.env.NODE_ENV || 'development');

    await createConnection({ ...options, name: 'default' });
    const app = express();
    app.use(
        cors({
            origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
            credentials: true,
        }),
    );
    let RedisStore = connectRedis(session);
    let redis = new Redis();
    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'none', // csrf
                secure: true, // cookie only works in https
            },
            secret: 'awerzjxerlkhqwilejhrjklasehriluh',
            resave: false,
            saveUninitialized: false,
        }),
    );

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
