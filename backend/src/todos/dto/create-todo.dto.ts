import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;
}
