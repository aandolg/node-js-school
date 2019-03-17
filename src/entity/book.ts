import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Length, IsNotEmpty} from 'class-validator';
import {User} from "./user";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 80
    })
    @Length(0, 80)
    @IsNotEmpty()
    name: string;

    @Column({
        length: 100
    })
    description: string;

    @Column({default: () => `now()`})
    date: string

    @ManyToOne(type => User, user => user.books)
    user: User;
}
