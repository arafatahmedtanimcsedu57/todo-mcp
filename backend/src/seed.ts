import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './todos/todo.entity';
import { Repository } from 'typeorm';

const now = new Date();
const daysFromNow = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

const seeds = [
  { title: 'Buy groceries', completed: false, due_date: daysFromNow(3) },
  { title: 'Submit project report', completed: false, due_date: daysFromNow(-2) },
  { title: 'Call the dentist', completed: true, due_date: daysFromNow(-5) },
  { title: 'Read a book', completed: false, due_date: null },
  { title: 'Fix login bug', completed: false, due_date: daysFromNow(-1) },
  { title: 'Write unit tests', completed: true, due_date: daysFromNow(7) },
  { title: 'Update resume', completed: false, due_date: daysFromNow(10) },
  { title: 'Pay electricity bill', completed: false, due_date: daysFromNow(-4) },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const repo = app.get<Repository<Todo>>(getRepositoryToken(Todo));

  await repo.clear();
  await repo.save(seeds.map((s) => repo.create(s)));

  console.log(`Seeded ${seeds.length} todos.`);
  await app.close();
}

bootstrap();
