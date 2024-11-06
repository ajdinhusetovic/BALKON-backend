import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorEntity } from './author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/createAuthor.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
  ) {}

  async getAuthors() {
    const authors = await this.authorRepository.find();

    if (!authors) {
      throw new NotFoundException('There are no authors');
    }

    return authors;
  }

  async createAuthor(createAuthorDto: CreateAuthorDto) {
    const author = new AuthorEntity();
    Object.assign(author, createAuthorDto);

    return await this.authorRepository.save(author);
  }

  async getAuthor(id: string) {
    const author = await this.authorRepository.findOne({ where: { id } });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  async updateAuthor(id: string, updateAuthorDto: CreateAuthorDto) {
    const author = await this.authorRepository.findOne({ where: { id } });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    Object.assign(author, updateAuthorDto);

    return await this.authorRepository.save(author);
  }

  async deleteAuthor(id: string) {
    const author = await this.authorRepository.findOne({ where: { id } });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    await this.authorRepository.remove(author);

    return { message: `Author with ID of ${id} successfully removed` };
  }
}
