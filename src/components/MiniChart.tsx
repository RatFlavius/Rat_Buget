import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MiniChartProps {
  income: number;
  expenses: number;
  type: 'monthly' | 'yearly';
}

const MiniChart: React.FC<MiniChartProps> = ({ income, expenses, type }) => {
  const maxAmount = Math.max(income, expenses);
  const incomePercentage = maxAmount > 0 ? (income / maxAmount) * 100 : 0;
  const expensePercentage = maxAmount > 0 ? (expenses / maxAmount) * 100 : 0;
  const balance = income - expenses;

  return (
    <div className="absolute top-2 right-2 w-16 h-12 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
      <div className="space-y-1">
        {/* Income bar */}
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-2 h-2 text-green-500" />
          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
            <div 
              className="bg-green-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${incomePercentage}%` }}
            />
          </div>
        </div>
        
        {/* Expense bar */}
        <div className="flex items-center space-x-1">
          <TrendingDown className="w-2 h-2 text-red-500" />
          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
            <div 
              className="bg-red-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${expensePercentage}%` }}
            />
          </div>
        </div>
        
        {/* Balance indicator */}
        <div className="text-center">
          <div className={`text-xs font-bold ${
            balance >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {balance >= 0 ? '+' : ''}
            {Math.abs(balance) > 1000 
              ? `${(balance / 1000).toFixed(1)}k` 
              : balance.toFixed(0)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniChart;