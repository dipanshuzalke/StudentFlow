import api from './api';
import type { CalendarEvent } from '../types';

export const eventService = {
  async getEvents(): Promise<CalendarEvent[]> {
    const response = await api.get('/events');
    return response.data.data.map((event: any) => ({
      ...event,
      id: event._id,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  },

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const response = await api.post('/events', event);
    const newEvent = response.data.data;
    return {
      ...newEvent,
      id: newEvent._id,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
    };
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const response = await api.put(`/events/${id}`, updates);
    const updatedEvent = response.data.data;
    return {
      ...updatedEvent,
      id: updatedEvent._id,
      start: new Date(updatedEvent.start),
      end: new Date(updatedEvent.end),
    };
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};