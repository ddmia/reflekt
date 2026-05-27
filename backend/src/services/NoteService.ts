import { ITaskRepository } from '../repositories/TaskRepository';
import { INoteRepository } from '../repositories/NoteRepository';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto } from '../dtos/note.dto';

export class NoteService {
  constructor(private taskRepo: ITaskRepository, private noteRepo: INoteRepository) {}

  listByTask(taskId: number): NoteResponseDto[] {
    return this.noteRepo.findByTaskId(taskId);
  }

  create(taskId: number, dto: CreateNoteDto): NoteResponseDto {
    const task = this.taskRepo.findById(taskId);
    if (!task) throw { status: 404, message: 'Tarefa não encontrada' };
    return this.noteRepo.create(taskId, dto);
  }

  update(id: number, dto: UpdateNoteDto): NoteResponseDto | null {
    return this.noteRepo.update(id, dto);
  }

  delete(id: number): boolean {
    return this.noteRepo.delete(id);
  }
}
