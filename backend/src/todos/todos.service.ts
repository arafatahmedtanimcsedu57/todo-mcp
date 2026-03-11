import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todosRepository.find({ order: { created_at: 'DESC' } });
  }

  async create(dto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create(dto);
    return this.todosRepository.save(todo);
  }

  async update(id: number, dto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todosRepository.findOneBy({ id });
    if (!todo) throw new NotFoundException(`Todo #${id} not found`);
    Object.assign(todo, dto);
    return this.todosRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.todosRepository.findOneBy({ id });
    if (!todo) throw new NotFoundException(`Todo #${id} not found`);
    await this.todosRepository.remove(todo);
  }
}
