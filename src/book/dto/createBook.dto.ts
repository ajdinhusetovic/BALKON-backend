import { IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  readonly isbn: string;

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly pages: number;

  @IsNotEmpty()
  readonly published: number;
}
