import { User } from '@/entities/User';
import { InputType, Field, ObjectType } from 'type-graphql';

@InputType()
export class UserInputType {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

@ObjectType()
export class LoginResponseType {
    @Field(() => User, { nullable: true })
    entity?: User;
}
