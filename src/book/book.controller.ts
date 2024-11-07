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
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBook.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookEntity } from './book.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Create a new book',
    description:
      'This endpoint allows you to create a new book with details such as ISBN, title, pages, and publication year.',
  })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
  })
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
  ) {
    if (image) {
      return await this.bookService.createBook(
        createBookDto,
        image.originalname,
        image.buffer,
      );
    }

    return await this.bookService.createBook(createBookDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all books',
    description: 'Retrieve all books.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all books',
    type: [BookEntity],
  })
  async getAllBooks() {
    return await this.bookService.getAllBooks();
  }

  @Get(':isbn')
  @ApiOperation({ summary: 'Get a book by ISBN' })
  @ApiParam({
    name: 'isbn',
    description: 'The ISBN of the book',
    type: String,
    example: '978-3-16-148410-0',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the book details',
    type: BookEntity,
    example: {
      isbn: '978-3-16-148410-0',
      title: 'Sample Book Title',
      pages: 250,
      published: 2022,
      image: 'https://example.com/image.jpg',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
    example: {
      statusCode: 404,
      message: 'Book not found',
    },
  })
  async getBook(@Param('isbn') isbn: string) {
    return await this.bookService.getBook(isbn);
  }

  @Delete(':isbn')
  @ApiOperation({ summary: 'Delete a book by ISBN' })
  @ApiParam({
    name: 'isbn',
    description: 'The ISBN of the book to delete',
    type: String,
    example: '978-3-16-148410-0',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the book',
    example: {
      message: 'Book successfully deleted',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
    example: {
      statusCode: 404,
      message: 'Book not found',
    },
  })
  async deleteBook(@Param('isbn') isbn: string) {
    return await this.bookService.deleteBook(isbn);
  }

  @Put(':isbn')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update a book by ISBN' })
  @ApiParam({
    name: 'isbn',
    description: 'The ISBN of the book to update',
    type: String,
    example: '978-3-16-148410-0',
  })
  @ApiBody({
    description: 'Book update data',
    type: CreateBookDto,
    schema: {
      example: {
        isbn: '978-3-16-148410-0',
        title: 'Updated Book Title',
        pages: 300,
        published: 2023,
        image: 'https://example.com/new-image.jpg',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the book details',
    type: BookEntity,
    example: {
      isbn: '978-3-16-148410-0',
      title: 'Updated Book Title',
      pages: 180,
      published: 1925,
      image: 'https://example.com/new-image.jpg',
    },
  })
  async updateBook(
    @Param('isbn') isbn: string,
    @Body() updateBookDto: CreateBookDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
  ) {
    if (image) {
      return await this.bookService.updateBook(
        isbn,
        updateBookDto,
        image.originalname,
        image.buffer,
      );
    }

    return await this.bookService.updateBook(isbn, updateBookDto);
  }

  @Get(':isbn/authors')
  @ApiOperation({ summary: 'Get authors for a book by ISBN' })
  @ApiParam({
    name: 'isbn',
    description: 'The ISBN of the book',
    type: String,
    example: '978-3-16-148410-0',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved authors for the book',
    example: [
      { id: 'author1', name: 'Author One' },
      { id: 'author2', name: 'Author Two' },
    ],
  })
  async getAuthorsForBook(@Param('isbn') isbn: string) {
    return await this.bookService.getAuthorsForBook(isbn);
  }

  @Post(':isbn/authors')
  @ApiOperation({ summary: 'Add an author to a book' })
  @ApiParam({
    name: 'isbn',
    description: 'The ISBN of the book',
    type: String,
    example: '978-3-16-148410-0',
  })
  @ApiBody({
    description: 'Author ID to be added to the book',
    schema: {
      example: { authorId: 'author1' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully added the author to the book',
    example: {
      message: 'Author added successfully',
    },
  })
  async addAuthorToBook(
    @Param('isbn') isbn: string,
    @Body('authorId') authorId: string,
  ) {
    return await this.bookService.addAuthorToBook(isbn, authorId);
  }

  @Delete(':isbn/authors/:authorId')
  @ApiOperation({ summary: 'Remove an author from a book' })
  @ApiParam({
    name: 'isbn',
    description: 'The ISBN of the book',
    type: String,
    example: '978-3-16-148410-0',
  })
  @ApiParam({
    name: 'authorId',
    description: 'The ID of the author to remove from the book',
    type: String,
    example: 'author1',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully removed the author from the book',
    example: {
      message: 'Author removed successfully',
    },
  })
  async deleteAuthorFromBook(
    @Param('isbn') isbn: string,
    @Param('authorId') authorId: string,
  ) {
    return await this.bookService.deleteAuthorFromBook(isbn, authorId);
  }
}
