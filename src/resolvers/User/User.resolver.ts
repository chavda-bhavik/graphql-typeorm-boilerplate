import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import {
    createEntity,
    findEntityOrThrow,
    getData,
    removeEntity,
    updateEntity,
    validEmail,
} from '@/util/typeorm';

import { User } from '@/entities/User';
import { UserInputType, UserResponseType } from './UserTypes';
import { MyContext, TokenDecoded } from '@/global';
import { cookieConfig } from '@/constants';
import { AuthMiddleware } from '@/middlewares/Auth';

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponseType)
    async register(@Arg('data') data: UserInputType): Promise<UserResponseType> {
        data.password = bcrypt.hashSync(data.password);
        let error = await validEmail(User, data.email);
        if (error) return { errors: [error] };
        let user = createEntity(User, data);
        return user;
    }

    @Mutation(() => User)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { req, res }: MyContext,
    ): Promise<User> {
        console.log(req.cookies, req.signedCookies);
        let user = await findEntityOrThrow(User, undefined, {
            where: { email },
        });
        let result = await bcrypt.compare(password, user.password);
        if (!result) throw new Error('User not found');

        let tokenData: TokenDecoded = { userId: user.id };
        let token = sign(tokenData, process.env.jwt_secret!);
        res.cookie('token', token, cookieConfig);
        return user;
    }

    @Query(() => User)
    @UseMiddleware(AuthMiddleware)
    me(@Ctx() { user }: MyContext): User {
        return user;
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        let users = await getData(User);
        return users;
    }

    @Query(() => User)
    async user(@Arg('id') id: number): Promise<User | undefined> {
        let user = await findEntityOrThrow(User, id);
        return user;
    }

    @Mutation(() => UserResponseType)
    async updateUser(
        @Arg('id') id: number,
        @Arg('data') data: UserInputType,
    ): Promise<UserResponseType> {
        return updateEntity(User, id, data);
    }

    @Mutation(() => User)
    async deleteUser(@Arg('id') id: number): Promise<User | undefined> {
        return removeEntity(User, id);
    }
}
