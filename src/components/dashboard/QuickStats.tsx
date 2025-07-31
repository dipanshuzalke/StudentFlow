import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, DollarSign, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export function QuickStats() {
  const { tasks, expenses, notes } = useApp(); // Add notes here
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const todaysExpenses = expenses.filter(expense => {
    const today = new Date();
    return expense.date.toDateString() === today.toDateString();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const totalNotes = notes ? notes.length : 0; // Get notes count

  const stats = [
    {
      label: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      label: "Today's Expenses",
      value: `₹${todaysExpenses.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Total Notes',
      value: totalNotes, // Use dynamic notes count
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}