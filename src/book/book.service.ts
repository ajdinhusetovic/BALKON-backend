import { Injectable } from '@nestjs/common';
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
}
