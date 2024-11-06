import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './author.entity';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorEntity]),
    forwardRef(() => BookModule),
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [TypeOrmModule.forFeature([AuthorEntity])],
})
export class AuthorModule {}
