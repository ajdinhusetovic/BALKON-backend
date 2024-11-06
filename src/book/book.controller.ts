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
}
