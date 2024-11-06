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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/createAuthor.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async getAuthors() {
    return await this.authorService.getAuthors();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return await this.authorService.createAuthor(createAuthorDto);
  }

  @Get(':id')
  async getAuthor(@Param('id') id: string) {
    return await this.authorService.getAuthor(id);
  }

  @Put(':id')
  async updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: CreateAuthorDto,
  ) {
    return await this.authorService.updateAuthor(id, updateAuthorDto);
  }

  @Delete(':id')
  async deleteAuthor(@Param('id') id: string) {
    return await this.authorService.deleteAuthor(id);
  }

  @Post(':id/books')
  async addBookToAuthor(
    @Param('id') id: string, // Correctly capturing the ID from the route
    @Body('isbn') isbn: string, // Assuming ISBN is passed in the body
  ) {
    return this.authorService.addBookToAuthor(id, isbn);
  }

  @Get(':id/books')
  async getBooksFromAuthor(@Param('id') id: string) {
    return await this.authorService.getBooksFromAuthor(id);
  }

  @Delete(':id/books/:isbn')
  async deleteAuthorFromBook(
    @Param('id') id: string,
    @Param('isbn') isbn: string,
  ) {
    return await this.authorService.deleteAuthorFromBook(id, isbn);
  }
}
