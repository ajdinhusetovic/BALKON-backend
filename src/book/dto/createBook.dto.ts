import { IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'ISBN is required' })
  readonly isbn: string;

  @IsNotEmpty({ message: 'Title is required' })
  readonly title: string;

  @IsNotEmpty({ message: 'Pages is required' })
  readonly pages: number;

  @IsNotEmpty({ message: 'Published is required' })
  readonly published: number;
}
