import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '@/entities/User';
import {
    createEntity,
    findEntityOrThrow,
    getData,
    removeEntity,
    updateEntity,
    validEmail,
} from '@/util/typeorm';
import { ResponseType } from '../SharedTypes';
import { UserInputType } from './UserTypes';
import { MyContext } from '@/global';
import { salt } from '@/constants';

@Resolver()
export class UserResolver {
    @Mutation(() => ResponseType)
    async register(@Arg('data') data: UserInputType): Promise<ResponseType> {
        data.password = bcrypt.hashSync(data.password, salt);
        let error = await validEmail(User, data.email);
        if (error) return { errors: [error] };
        let user = createEntity(User, data);
        return user;
    }

    @Mutation(() => User)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext,
    ): Promise<User> {
        console.log(req.cookies, req.signedCookies, req.session);
        let user = await findEntityOrThrow(User, undefined, {
            where: { email },
        });
        let result = await bcrypt.compare(password, user.password);
        if (!result) throw new Error('User not found');
        req.session.userId = user.id;
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

    @Mutation(() => ResponseType)
    async updateUser(
        @Arg('id') id: number,
        @Arg('data') data: UserInputType,
    ): Promise<ResponseType> {
        return updateEntity(User, id, data);
    }

    @Mutation(() => User)
    async deleteUser(@Arg('id') id: number): Promise<User | undefined> {
        return removeEntity(User, id);
    }
}
