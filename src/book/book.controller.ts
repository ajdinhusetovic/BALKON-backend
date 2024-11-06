import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBook.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.createBook(createBookDto);
  }

  @Get()
  async getAllBooks() {
    return await this.bookService.getAllBooks();
  }

  @Get(':isbn')
  async getBook(@Param('isbn') isbn: string) {
    return await this.bookService.getBook(isbn);
  }

  @Delete(':isbn')
  async deleteBook(@Param('isbn') isbn: string) {
    return await this.bookService.deleteBook(isbn);
  }

  @Put(':isbn')
  async updateBook(
    @Param('isbn') isbn: string,
    @Body() updateBookDto: CreateBookDto,
  ) {
    return await this.bookService.updateBook(isbn, updateBookDto);
  }

  @Get(':isbn/authors')
  async getAuthorsForBook(@Param('isbn') isbn: string) {
    return await this.bookService.getAuthorsForBook(isbn);
  }

  @Post(':isbn/authors')
  async addAuthorToBook(
    @Param('isbn') isbn: string, // Get the ISBN from the URL
    @Body('authorId') authorId: string, // Get the authorId from the request body
  ) {
    return await this.bookService.addAuthorToBook(isbn, authorId);
  }

  @Delete(':isbn/authors/:authorId')
  async deleteAuthorFromBook(
    @Param('isbn') isbn: string,
    @Param('authorId') authorId: string,
  ) {
    return await this.bookService.deleteAuthorFromBook(isbn, authorId);
  }
}
