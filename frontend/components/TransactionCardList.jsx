import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, ShoppingBag, Coffee, UtensilsCrossed } from 'lucide-react';

const TransactionCardList = ({ data = [] }) => {

    console.log(data);

  // Category to icon mapping
  const categoryIcons = {
    Transport: Car,
    Market: ShoppingBag,
    Coffe: Coffee,
    Restaurant: UtensilsCrossed,
  };

  // Category to color mapping
  const categoryColors = {
    Transport: 'from-orange-500 to-amber-500',
    Market: 'from-emerald-500 to-teal-500',
    Coffe: 'from-amber-500 to-yellow-500',
    Restaurant: 'from-pink-500 to-rose-500',
  };

  // Format date from "2024-09-28 04:04:41 +0000" to "Sep 28, 2024 • 4:04 AM"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const datePart = date.toLocaleDateString('en-US', options);
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    const timePart = `${hours}:${minutes} ${ampm}`;
    
    return `${datePart} • ${timePart}`;
  };

  // Format amount to currency
  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return `$${num.toFixed(2)}`;
  };

  // Single transaction card component
  const TransactionCard = ({ transaction }) => {
    const Icon = categoryIcons[transaction.category] || ShoppingBag;
    const colorGradient = categoryColors[transaction.category] || 'from-slate-500 to-slate-600';
    
    return (
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-10 h-10 bg-gradient-to-br ${colorGradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-200 truncate">{transaction.category}</p>
                <p className="text-xs text-slate-400">{formatDate(transaction.date)}</p>
              </div>
            </div>
            <div className="ml-4 text-right flex-shrink-0">
              <p className="text-lg font-bold text-slate-100">{formatAmount(transaction.amount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-3">
      {data.map((transaction, index) => (
        <TransactionCard key={index} transaction={transaction} />
      ))}
    </div>
  );
};


export default TransactionCardList;