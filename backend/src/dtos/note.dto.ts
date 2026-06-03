import { Note } from '../domain/Note';

export interface CreateNoteDto {
  content: string;
}

export interface UpdateNoteDto {
  content: string;
}

export type NoteResponseDto = Note;
