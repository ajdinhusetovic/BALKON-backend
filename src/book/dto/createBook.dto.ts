import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Unique ISBN of the book',
    example: '978-3-16-148410-0', // Example value for ISBN
  })
  @IsNotEmpty({ message: 'ISBN is required' })
  readonly isbn: string;

  @ApiProperty({
    description: 'Title of the book',
    example: 'The Great Gatsby', // Example value for Title
  })
  @IsNotEmpty({ message: 'Title is required' })
  readonly title: string;

  @ApiProperty({
    description: 'Number of pages in the book',
    example: 180, // Example value for Pages
  })
  @IsNotEmpty({ message: 'Pages is required' })
  readonly pages: number;

  @ApiProperty({
    description: 'Year the book was published',
    example: 1925, // Example value for Published Year
  })
  @IsNotEmpty({ message: 'Published year is required' })
  readonly published: number;
}
