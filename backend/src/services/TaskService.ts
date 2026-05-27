import { ITaskRepository } from '../repositories/TaskRepository';
import { INoteRepository } from '../repositories/NoteRepository';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../dtos/task.dto';

export class TaskService {
  constructor(private taskRepo: ITaskRepository, private noteRepo: INoteRepository) {}

  list(filters?: { status?: string; priority?: string; tag?: string }): TaskResponseDto[] {
    return this.taskRepo.findAll(filters);
  }

  get(id: number): TaskResponseDto | null {
    return this.taskRepo.findById(id);
  }

  create(dto: CreateTaskDto): TaskResponseDto {
    return this.taskRepo.create(dto);
  }

  update(id: number, dto: UpdateTaskDto): TaskResponseDto | null {
    return this.taskRepo.update(id, dto);
  }

  delete(id: number): boolean {
    // delete notes first
    this.noteRepo.deleteByTaskId(id);
    return this.taskRepo.delete(id);
  }
}
