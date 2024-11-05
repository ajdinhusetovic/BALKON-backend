import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'books' })
export class BookEntity {
  @PrimaryColumn()
  isbn: string;
}
