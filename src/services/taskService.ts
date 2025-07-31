import api from './api';
import type { Task } from '../types';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data.data.map((task: any) => ({
      ...task,
      id: task._id,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: new Date(task.createdAt),
    }));
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const response = await api.post('/tasks', task);
    const newTask = response.data.data;
    return {
      ...newTask,
      id: newTask._id,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      createdAt: new Date(newTask.createdAt),
    };
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, updates);
    const updatedTask = response.data.data;
    return {
      ...updatedTask,
      id: updatedTask._id,
      dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
      createdAt: new Date(updatedTask.createdAt),
    };
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};