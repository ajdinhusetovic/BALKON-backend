import { Column, Entity, PrimaryColumn } from 'typeorm';

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

  @Column('simple-array', { default: '' })
  authors: string[];

  @Column({ default: '' })
  image: string;
}
