import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { Repository } from 'typeorm';
import { AuthorEntity } from 'src/author/author.entity';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class BookService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,

    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
  ) {}

  async createBook(
    createBookDto: CreateBookDto,
    fileName?: string,
    file?: Buffer,
  ) {
    const book = new BookEntity();
    Object.assign(book, createBookDto);

    if (file && fileName) {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'balkon-images',
          Key: fileName,
          Body: file,
        }),
      );
      book.image = `https://balkon-images.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    return await this.bookRepository.save(book);
  }

  async getAllBooks() {
    const books = await this.bookRepository.find({ relations: ['authors'] });

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

  async updateBook(
    isbn: string,
    updateBookDto: CreateBookDto,
    fileName?: string,
    file?: Buffer,
  ) {
    const book = await this.bookRepository.findOne({ where: { isbn } });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    Object.assign(book, updateBookDto);

    if (file && fileName) {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'balkon-images',
          Key: fileName,
          Body: file,
        }),
      );
      book.image = `https://balkon-images.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    return await this.bookRepository.save(book);
  }

  async deleteBook(isbn: string) {
    const book = await this.bookRepository.findOne({ where: { isbn } });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    if (book.image) {
      const fileKey = book.image.split('/').pop();

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: 'balkon-images',
          Key: fileKey,
        }),
      );
    }

    await this.bookRepository.remove(book);

    return { message: `Book with ISBN ${isbn} successfully deleted` };
  }

  async getAuthorsForBook(isbn: string) {
    const book = await this.bookRepository.findOne({
      where: { isbn },
      relations: ['authors'],
    });

    return book.authors;
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

    if (
      !book.authors.some((existingAuthor) => existingAuthor.id === author.id)
    ) {
      book.authors.push(author);
      await this.bookRepository.save(book);
    }

    return book;
  }

  async deleteAuthorFromBook(isbn: string, authorId: string) {
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

    const authorIndex = book.authors.findIndex(
      (existingAuthor) => existingAuthor.id === author.id,
    );

    if (authorIndex === -1) {
      throw new NotFoundException(
        `Author with ID ${authorId} is not linked to the book`,
      );
    }

    book.authors.splice(authorIndex, 1);

    await this.bookRepository.save(book);

    return book;
  }
}
