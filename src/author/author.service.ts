import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorEntity } from './author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/createAuthor.dto';
import { BookEntity } from 'src/book/book.entity';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class AuthorService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,

    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async getAuthors() {
    const authors = await this.authorRepository.find({ relations: ['books'] });

    if (!authors) {
      throw new NotFoundException('There are no authors');
    }

    return authors;
  }

  async createAuthor(
    createAuthorDto: CreateAuthorDto,
    fileName?: string,
    file?: Buffer,
  ) {
    const author = new AuthorEntity();
    Object.assign(author, createAuthorDto);

    if (file && fileName) {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'balkon-images',
          Key: fileName,
          Body: file,
        }),
      );
      author.image = `https://balkon-images.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    return await this.authorRepository.save(author);
  }

  async getAuthor(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  async updateAuthor(
    id: string,
    updateAuthorDto: CreateAuthorDto,
    fileName?: string,
    file?: Buffer,
  ) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    Object.assign(author, updateAuthorDto);

    if (file && fileName) {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'balkon-images',
          Key: fileName,
          Body: file,
        }),
      );
      author.image = `https://balkon-images.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    return await this.authorRepository.save(author);
  }

  async deleteAuthor(id: string) {
    const author = await this.authorRepository.findOne({ where: { id } });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    if (author.image) {
      const fileKey = author.image.split('/').pop();

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: 'balkon-images',
          Key: fileKey,
        }),
      );
    }

    await this.authorRepository.remove(author);

    return { message: `Author with ID of ${id} successfully removed` };
  }

  async getBooksFromAuthor(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author.books;
  }

  async addBookToAuthor(id: string, isbn: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    const book = await this.bookRepository.findOne({
      where: { isbn },
    });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    if (
      author.books.some(
        (existingBook) => String(existingBook.isbn) === String(book.isbn),
      )
    ) {
      throw new Error(
        `Author with ID ${id} is already associated with the book with ISBN ${isbn}`,
      );
    }

    author.books.push(book);
    await this.authorRepository.save(author);

    return author;
  }

  async deleteAuthorFromBook(id: string, isbn: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    const book = await this.bookRepository.findOne({
      where: { isbn },
    });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    const bookIndex = author.books.findIndex(
      (existingBook) => existingBook.isbn === book.isbn,
    );

    if (bookIndex === -1) {
      throw new NotFoundException(
        `Author with ID ${id} is not linked to the book`,
      );
    }

    author.books.splice(bookIndex, 1);

    await this.authorRepository.save(author);

    return author;
  }
}
