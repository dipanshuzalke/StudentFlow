import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={clsx(
        'bg-white dark:bg-gray-800/50 backdrop-blur-sm',
        'border border-gray-200/50 dark:border-gray-700/50',
        'rounded-2xl shadow-sm dark:shadow-gray-900/10',
        'transition-all duration-200',
        hover && 'hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/20',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}