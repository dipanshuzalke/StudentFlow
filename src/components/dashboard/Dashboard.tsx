import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { QuickStats } from './QuickStats';
import { TasksWidget } from './TasksWidget';
import { CalendarWidget } from './CalendarWidget';
import { ExpensesWidget } from './ExpensesWidget';
import { NotesWidget } from './NotesWidget';
import { AIAssistant } from './AIAssistant';

export function Dashboard() {
  const { user } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your productivity today.
        </p>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <TasksWidget />
        </div>
        <div>
          <AIAssistant />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CalendarWidget />
        <ExpensesWidget />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <NotesWidget />
      </div>
    </motion.div>
  );
}