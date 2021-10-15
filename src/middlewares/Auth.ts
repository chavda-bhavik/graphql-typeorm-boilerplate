import { verify } from 'jsonwebtoken';
import { MiddlewareFn, NextFn } from 'type-graphql';

import { User } from '@/entities';
import { findEntityOrThrow } from '@/util/typeorm';
import { MyContext, TokenDecoded } from '@/global';

export const AuthMiddleware: MiddlewareFn<MyContext> = async ({ context }, next: NextFn) => {
    try {
        let user: User;
        if (context.req.cookies.token) {
            // @ts-ignore
            var decoded: TokenDecoded = verify(context.req.cookies.token, process.env.jwt_secret!);
            user = await findEntityOrThrow(User, decoded.userId);
            if (!user) throw new Error("You're Unauthorized!");
            else {
                context.user = user;
                return next();
            }
        } else throw new Error("You're Unauthorized!");
    } catch (err) {
        throw new Error("You're Unauthorized!");
    }
};
