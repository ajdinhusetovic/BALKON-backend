import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { Repository } from 'typeorm';
import { AuthorEntity } from 'src/author/author.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,

    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
  ) {}

  async createBook(createBookDto: CreateBookDto) {
    const book = new BookEntity();
    Object.assign(book, createBookDto);

    return await this.bookRepository.save(book);
  }

  async getAllBooks() {
    const books = await this.bookRepository.find();

    return books;
  }

  async getBook(isbn: string) {
    const book = await this.bookRepository.findOne({
      where: { isbn },
      relations: ['authors'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    return book;
  }

  async updateBook(isbn: string, updateBookDto: CreateBookDto) {
    const book = await this.bookRepository.findOne({ where: { isbn } });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    Object.assign(book, updateBookDto);

    return await this.bookRepository.save(book);
  }

  async deleteBook(isbn: string) {
    const book = await this.bookRepository.findOne({ where: { isbn } });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    await this.bookRepository.remove(book);

    return { message: `Book with ISBN ${isbn} successfully deleted` };
  }

  async addAuthorToBook(isbn: string, authorId: string) {
    const book = await this.bookRepository.findOne({
      where: { isbn },
      relations: ['authors'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    const author = await this.authorRepository.findOne({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${authorId} not found`);
    }

    // Add the author to the book's authors array if not already linked
    if (
      !book.authors.some((existingAuthor) => existingAuthor.id === author.id)
    ) {
      book.authors.push(author);
      await this.bookRepository.save(book);
    }

    return book; // Return the updated book
  }
}
