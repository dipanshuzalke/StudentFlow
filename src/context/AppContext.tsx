import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Task, CalendarEvent, Expense, Note, AIMessage } from '../types';
import { useTheme } from '../hooks/useTheme';
import { authService } from '../services/authService';
import { taskService } from '../services/taskService';
import { eventService } from '../services/eventService';
import { expenseService } from '../services/expenseService';
import { noteService } from '../services/noteService';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  loadEvents: () => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  loadExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  loadNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  aiMessages: AIMessage[];
  setAiMessages: (messages: AIMessage[]) => void;
  theme: string;
  resolvedTheme: string;
  setTheme: (theme: any) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
          setUser(storedUser);
          await loadAllData();
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadTasks(),
        loadEvents(),
        loadExpenses(),
        loadNotes(),
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // Auth functions
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      await loadAllData();
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
      await loadAllData();
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setTasks([]);
    setEvents([]);
    setExpenses([]);
    setNotes([]);
    setAiMessages([]);
  };

  // Task functions
  const loadTasks = async () => {
    try {
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = await taskService.createTask(task);
      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  // Event functions
  const loadEvents = async () => {
    try {
      const eventsData = await eventService.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = await eventService.createEvent(event);
      setEvents(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = await eventService.updateEvent(id, updates);
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  };

  // Expense functions
  const loadExpenses = async () => {
    try {
      const expensesData = await expenseService.getExpenses();
      setExpenses(expensesData);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await expenseService.createExpense(expense);
      setExpenses(prev => [newExpense, ...prev]);
    } catch (error) {
      console.error('Failed to add expense:', error);
      throw error;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const updatedExpense = await expenseService.updateExpense(id, updates);
      setExpenses(prev => prev.map(expense => expense.id === id ? updatedExpense : expense));
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  };

  // Note functions
  const loadNotes = async () => {
    try {
      const notesData = await noteService.getNotes();
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newNote = await noteService.createNote(note);
      setNotes(prev => [newNote, ...prev]);
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await noteService.updateNote(id, updates);
      setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await noteService.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        tasks,
        setTasks,
        loadTasks,
        addTask,
        updateTask,
        deleteTask,
        events,
        setEvents,
        loadEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        expenses,
        setExpenses,
        loadExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        notes,
        setNotes,
        loadNotes,
        addNote,
        updateNote,
        deleteNote,
        aiMessages,
        setAiMessages,
        theme,
        resolvedTheme,
        setTheme,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}