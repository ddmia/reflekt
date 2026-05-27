import { Note } from '../domain/Note';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto } from '../dtos/note.dto';

export interface INoteRepository {
  findByTaskId(taskId: number): NoteResponseDto[];
  create(taskId: number, dto: CreateNoteDto): NoteResponseDto;
  update(id: number, dto: UpdateNoteDto): NoteResponseDto | null;
  delete(id: number): boolean;
  deleteByTaskId(taskId: number): void;
}

export class InMemoryNoteRepository implements INoteRepository {
  private notes: Note[] = [];
  private nextId = 1;

  findByTaskId(taskId: number): NoteResponseDto[] {
    return this.notes.filter(n => n.task_id === taskId).map(n => ({ ...n }));
  }

  create(taskId: number, dto: CreateNoteDto): NoteResponseDto {
    const now = new Date().toISOString();
    const note: Note = {
      id: this.nextId++,
      task_id: taskId,
      content: dto.content,
      created_at: now,
      updated_at: now,
    };
    this.notes.push(note);
    return { ...note };
  }

  update(id: number, dto: UpdateNoteDto): NoteResponseDto | null {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx === -1) return null;
    const existing = this.notes[idx];
    const updated: Note = {
      ...existing,
      content: dto.content ?? existing.content,
      updated_at: new Date().toISOString(),
    };
    this.notes[idx] = updated;
    return { ...updated };
  }

  delete(id: number): boolean {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx === -1) return false;
    this.notes.splice(idx, 1);
    return true;
  }

  deleteByTaskId(taskId: number): void {
    this.notes = this.notes.filter(n => n.task_id !== taskId);
  }
}
