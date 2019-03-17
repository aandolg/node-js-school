import { BaseContext } from 'koa';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { Book } from '../entity/book';
import { User } from '../entity/user';

export default class BookController {

    public static async createBook (ctx: BaseContext) {
        const  userRepository: Repository<User> = getManager().getRepository(User);
        const user: User = await userRepository.findOne(+ctx.request.body.userId || 0);
        if (user === undefined) {
            ctx.status = 400;
            ctx.body = 'User doesnt exist';
            return ctx;
        }

        // get a book repository to perform operations with book
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        // build up entity book to be saved
        const bookToBeSaved: Book = new Book();
        bookToBeSaved.name = ctx.request.body.name;
        bookToBeSaved.description = ctx.request.body.description;
        bookToBeSaved.date = ctx.request.body.date;
        // validate book entity
        const errors: ValidationError[] = await validate(bookToBeSaved); // errors is an array of validation errors

        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else if ( await bookRepository.findOne({ name: bookToBeSaved.name}) ) {
            // return BAD REQUEST status code and book name already exists error
            ctx.status = 400;
            ctx.body = 'The specified name already exists';
        } else {
            // save the book contained in the POST body
            bookToBeSaved.user = user;
            const book = await bookRepository.save(bookToBeSaved);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = book;
        }
    }
  }
