import { AuthorEntity } from 'src/author/author.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'books' })
export class BookEntity {
  @PrimaryColumn()
  isbn: string;

  @Column()
  title: string;

  @Column()
  pages: number;

  @Column()
  published: number;

  @Column({ default: '' })
  image: string;

  @ManyToMany(() => AuthorEntity, (author) => author.books)
  @JoinTable({
    name: 'book_authors',
    joinColumn: {
      name: 'book_isbn',
      referencedColumnName: 'isbn',
    },
    inverseJoinColumn: {
      name: 'author_id',
      referencedColumnName: 'id',
    },
  })
  authors: AuthorEntity[];
}
