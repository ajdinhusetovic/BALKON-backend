import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { BookEntity } from 'src/book/book.entity';

@Entity({ name: 'authors' })
export class AuthorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ default: '' })
  image: string;

  @ManyToMany(() => BookEntity, (book) => book.authors)
  books: BookEntity[];
}
