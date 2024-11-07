import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/createAuthor.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all authors',

    example: [
      { id: 'author1', name: 'Author One' },
      { id: 'author2', name: 'Author Two' },
    ],
  })
  async getAuthors() {
    return await this.authorService.getAuthors();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new author' })
  @ApiBody({
    description: 'Author creation data',
    type: CreateAuthorDto,
    schema: {
      example: {
        name: 'New Author',
        birthYear: 1980,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new author',

    example: {
      id: 'author1',
      name: 'New Author',
      birthYear: 1980,
    },
  })
  async create(
    @Body() createAuthorDto: CreateAuthorDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
  ) {
    if (image) {
      return await this.authorService.createAuthor(
        createAuthorDto,
        image.originalname,
        image.buffer,
      );
    }

    return await this.authorService.createAuthor(createAuthorDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an author by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the author',
    type: String,
    example: 'author1',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the author details',

    example: {
      id: 'author1',
      name: 'Author One',
      birthYear: 1975,
    },
  })
  async getAuthor(@Param('id') id: string) {
    return await this.authorService.getAuthor(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update an author by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the author to update',
    type: String,
    example: 'author1',
  })
  @ApiBody({
    description: 'Author update data',
    type: CreateAuthorDto,
    schema: {
      example: {
        name: 'Updated Author Name',
        birthYear: 1985,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the author',

    example: {
      id: 'author1',
      name: 'Updated Author Name',
      birthYear: 1985,
    },
  })
  async updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: CreateAuthorDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
  ) {
    if (image) {
      return await this.authorService.updateAuthor(
        id,
        updateAuthorDto,
        image.originalname,
        image.buffer,
      );
    }

    return await this.authorService.updateAuthor(id, updateAuthorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an author by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the author to delete',
    type: String,
    example: 'author1',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the author',

    example: {
      message: 'Author successfully deleted',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',

    example: {
      statusCode: 404,
      message: 'Author not found',
    },
  })
  async deleteAuthor(@Param('id') id: string) {
    return await this.authorService.deleteAuthor(id);
  }

  @Post(':id/books')
  @ApiOperation({ summary: 'Add a book to an author' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the author to whom the book will be added',
    type: String,
    example: 'author1',
  })
  @ApiBody({
    description: 'Book ISBN to associate with the author',
    schema: {
      example: { isbn: '978-3-16-148410-0' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully added the book to the author',

    example: {
      message: 'Book added successfully',
    },
  })
  async addBookToAuthor(@Param('id') id: string, @Body('isbn') isbn: string) {
    return await this.authorService.addBookToAuthor(id, isbn);
  }

  @Get(':id/books')
  @ApiOperation({ summary: 'Get all books for a given author' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the author whose books are being retrieved',
    type: String,
    example: 'author1',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the books for the author',

    example: [
      { isbn: '978-3-16-148410-0', title: 'Book One' },
      { isbn: '978-1-23-456789-0', title: 'Book Two' },
    ],
  })
  async getBooksFromAuthor(@Param('id') id: string) {
    return await this.authorService.getBooksFromAuthor(id);
  }

  @Delete(':id/books/:isbn')
  @ApiOperation({ summary: 'Remove a book from an author by ISBN' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the author from whom the book will be removed',
    type: String,
    example: 'author1',
  })
  @ApiParam({
    name: 'isbn',
    description: 'The ISBN of the book to remove from the author',
    type: String,
    example: '978-3-16-148410-0',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully removed the book from the author',

    example: {
      message: 'Book removed from author successfully',
    },
  })
  async deleteAuthorFromBook(
    @Param('id') id: string,
    @Param('isbn') isbn: string,
  ) {
    return await this.authorService.deleteAuthorFromBook(id, isbn);
  }
}
