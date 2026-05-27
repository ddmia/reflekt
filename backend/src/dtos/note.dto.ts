export type CreateNoteDto = {
  content: string;
};

export type UpdateNoteDto = {
  content: string;
};

export type NoteResponseDto = {
  id: number;
  task_id: number;
  content: string;
  created_at: string;
  updated_at: string;
};
