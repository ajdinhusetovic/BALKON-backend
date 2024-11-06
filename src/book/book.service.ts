import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
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
    const book = await this.bookRepository.findOne({ where: { isbn } });

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
}
