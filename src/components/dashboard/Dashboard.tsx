import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { QuickStats } from './QuickStats';
import { TasksWidget } from './TasksWidget';
import { ExpensesWidget } from './ExpensesWidget';
import { NotesWidget } from './NotesWidget';
import  AIAssistant  from './AIAssistant';
import TimerComponent from './timerComponent/TimerComponent';
import Calendar from './calendarComponent.tsx/CalendarComponent';

export function Dashboard() {
  const { user } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your productivity today.
        </p>
        </div>
         <div>
          <AIAssistant />
        </div>
      </div>

      <QuickStats />

      <div className="flex gap-3 2xl:gap-6 w-full h-auto flex-col [min-width:700px]:flex-col lg:flex-row z-0">
          <div className="flex-1 h-100 flex flex-col gap-4 2xl:gap-6">
            <div className="flex bg-sec rounded-3xl shadow">
              <TimerComponent />
              {/* <StudyStats /> */}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 2xl:gap-6 flex-1 notes-goals-grid">
               <TasksWidget />
               <NotesWidget />
            </div>
          </div>
          <Calendar />
        </div>

      <div className="grid grid-cols-1 mt-8">
        
        <ExpensesWidget />
      </div>
    </motion.div>
  );
}