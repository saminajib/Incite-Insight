import React, { useState } from 'react';
import { Search, Bell, User, TrendingUp, TrendingDown, DollarSign, PiggyBank, Lightbulb, Target, AlertCircle, Sparkles, ArrowUpRight, ArrowDownRight, Filter, ChevronDown, BarChart3, PieChart, LineChart, Calendar } from 'lucide-react';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { ChartRadarDots } from '@/components/chart-radar-dots';

const BudgetDashboard = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Fixed Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Incite Insight
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-xl transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-200 font-medium">John Doe</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        
        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Financial Overview</h2>
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Total Balance', value: '$0.00', icon: DollarSign, color: 'from-cyan-500 to-blue-500', glow: 'cyan' },
              { label: 'Monthly Income', value: '$0.00', icon: TrendingUp, color: 'from-emerald-500 to-teal-500', glow: 'emerald' },
              { label: 'Monthly Expenses', value: '$0.00', icon: TrendingDown, color: 'from-pink-500 to-rose-500', glow: 'rose' },
              { label: 'Savings Rate', value: '0%', icon: PiggyBank, color: 'from-purple-500 to-indigo-500', glow: 'purple' }
            ].map((metric, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl`}></div>
                <div className="relative backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
                  <p className="text-3xl font-bold text-white">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph Cards Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Analytics</h2>
          <div className="grid grid-cols-12 gap-5">
            {/* Spending Trends - Wide */}
            <div className="col-span-8 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-cyan-400" />
                    Spending Trends
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Monthly spending patterns over time</p>
                </div>
                <ChartAreaInteractive />
              </div>
            </div>
            
            {/* Category Breakdown - Medium */}
            <div className="col-span-4 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-400" />
                  Category Breakdown
                </h3>
                <p className="text-slate-400 text-sm mt-1">Spending by category</p>
              </div>
              {/* <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-xl">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500">Chart placeholder</p>
                </div>
              </div> */}
              <div className="grid-cols-12">
                <div className="col-span-4">
                  <ChartRadarDots></ChartRadarDots>
                </div>
              </div>
            </div>

            {/* Income Sources */}
            <div className="col-span-4 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Income Sources
                </h3>
                <p className="text-slate-400 text-sm mt-1">Revenue stream breakdown</p>
              </div>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-xl">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500">Chart placeholder</p>
                </div>
              </div>
            </div>

            {/* Net Worth Over Time - Wide */}
            <div className="col-span-8 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    Net Worth Over Time
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Track your wealth accumulation</p>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-xl">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500">Chart placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity rounded-3xl"></div>
            <div className="relative backdrop-blur-xl bg-slate-800/40 border border-purple-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AI Financial Insights
                  </h2>
                  <p className="text-slate-400 text-sm">Personalized recommendations powered by AI</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: Lightbulb, title: 'Smart Savings Opportunity', color: 'from-yellow-400 to-orange-400', text: 'AI insight will appear here' },
                  { icon: Target, title: 'Goal Achievement', color: 'from-emerald-400 to-teal-400', text: 'AI insight will appear here' },
                  { icon: AlertCircle, title: 'Spending Alert', color: 'from-pink-400 to-rose-400', text: 'AI insight will appear here' },
                  { icon: TrendingUp, title: 'Investment Suggestion', color: 'from-cyan-400 to-blue-400', text: 'AI insight will appear here' }
                ].map((insight, idx) => (
                  <div key={idx} className="backdrop-blur-sm bg-slate-700/30 border border-slate-600/30 rounded-xl p-5 hover:border-slate-500/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${insight.color} shrink-0`}>
                        <insight.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">{insight.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{insight.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Predictions Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Predicted Financial Outlook</h2>
          <div className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
            <div className="grid grid-cols-3 gap-6">
              {['Next Month', '3 Months', '6 Months'].map((period, idx) => (
                <div key={idx} className="relative">
                  <div className="backdrop-blur-sm bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:border-cyan-500/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400 font-medium">{period}</span>
                      <div className="flex items-center gap-1 text-emerald-400">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm font-semibold">0%</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-white mb-1">$0.00</p>
                      <p className="text-slate-500 text-sm">Projected Balance</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Income</span>
                        <span className="text-emerald-400 font-semibold">$0.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Expenses</span>
                        <span className="text-rose-400 font-semibold">$0.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Savings</span>
                        <span className="text-cyan-400 font-semibold">$0.00</span>
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{width: '0%'}}></div>
                    </div>
                  </div>
                  {idx < 2 && (
                    <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-cyan-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Recent Transactions</h2>
          <div className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {['All', 'Income', 'Expenses', 'Categories'].map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors border border-slate-600/30 hover:border-slate-500/50"
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors border border-slate-600/30 hover:border-slate-500/50">
                <Filter className="w-4 h-4" />
                Filter
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
              <div className="space-y-3">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 border border-slate-600/20 hover:border-slate-600/40 hover:bg-slate-700/40 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        idx % 3 === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                        idx % 3 === 1 ? 'bg-gradient-to-br from-pink-500 to-rose-500' :
                        'bg-gradient-to-br from-purple-500 to-indigo-500'
                      }`}>
                        {idx % 3 === 0 ? <TrendingUp className="w-6 h-6 text-white" /> :
                         idx % 3 === 1 ? <TrendingDown className="w-6 h-6 text-white" /> :
                         <DollarSign className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Transaction Name</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            idx % 3 === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                            idx % 3 === 1 ? 'bg-rose-500/20 text-rose-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {idx % 3 === 0 ? 'Income' : idx % 3 === 1 ? 'Food & Dining' : 'Shopping'}
                          </span>
                          <span className="text-slate-500 text-xs">• Oct {25 - idx}, 2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        idx % 3 === 0 ? 'text-emerald-400' : 'text-slate-200'
                      }`}>
                        {idx % 3 === 0 ? '+' : '-'}$0.00
                      </p>
                      <p className="text-slate-500 text-xs">Pending</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BudgetDashboard;