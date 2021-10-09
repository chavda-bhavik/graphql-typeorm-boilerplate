import { Field, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import * as Yup from 'yup';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    static validations = Yup.object().shape({
        firstName: Yup.string().required().max(100),
        lastName: Yup.string().required().max(100),
    });

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    firstName: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    lastName: string;

    @Field()
    @Column({ type: 'text', unique: true })
    email!: string;

    @Column({ type: 'text' })
    password: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted?: Date;
}
