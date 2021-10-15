import { User } from '@/entities/User';
import { InputType, Field, ObjectType } from 'type-graphql';
import { FieldError } from '../SharedTypes';

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

@ObjectType()
export class UserResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    entity?: User;
}
