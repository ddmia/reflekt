import { Task, Note, Tag } from '../domain/types';

export interface TaskResponseDto extends Task {
  tags: Tag[];
  notes: Note[];
}

export type NoteResponseDto = Note;
export type TagResponseDto = Tag;
