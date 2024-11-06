import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'The first name of the author',
    example: 'John',
  })
  @IsNotEmpty({ message: 'First name is required' })
  readonly firstName: string;

  @ApiProperty({
    description: 'The last name of the author',
    example: 'Doe',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  readonly lastName: string;

  @ApiProperty({
    description: 'The date of birth of the author',
    example: '1980-01-01T00:00:00Z',
  })
  @IsNotEmpty({ message: 'Date of birth is required' })
  readonly dob: Date;
}
