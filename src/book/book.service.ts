import { Injectable } from '@nestjs/common';

@Injectable()
export class BookService {
  findAll(): string[] {
    return ['book1', 'book2'];
  }
}
