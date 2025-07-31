import api from './api';
import type { Note } from '../types';

export const noteService = {
  async getNotes(search?: string, subject?: string): Promise<Note[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (subject) params.append('subject', subject);
    
    const response = await api.get(`/notes?${params.toString()}`);
    return response.data.data.map((note: any) => ({
      ...note,
      id: note._id,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  },

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const response = await api.post('/notes', note);
    const newNote = response.data.data;
    return {
      ...newNote,
      id: newNote._id,
      createdAt: new Date(newNote.createdAt),
      updatedAt: new Date(newNote.updatedAt),
    };
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const response = await api.put(`/notes/${id}`, updates);
    const updatedNote = response.data.data;
    return {
      ...updatedNote,
      id: updatedNote._id,
      createdAt: new Date(updatedNote.createdAt),
      updatedAt: new Date(updatedNote.updatedAt),
    };
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};