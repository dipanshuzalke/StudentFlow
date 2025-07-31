import api from './api';
import type { Expense } from '../types';

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    const response = await api.get('/expenses');
    return response.data.data.map((expense: any) => ({
      ...expense,
      id: expense._id,
      date: new Date(expense.date),
    }));
  },

  async createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const response = await api.post('/expenses', expense);
    const newExpense = response.data.data;
    return {
      ...newExpense,
      id: newExpense._id,
      date: new Date(newExpense.date),
    };
  },

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
    const response = await api.put(`/expenses/${id}`, updates);
    const updatedExpense = response.data.data;
    return {
      ...updatedExpense,
      id: updatedExpense._id,
      date: new Date(updatedExpense.date),
    };
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },
};