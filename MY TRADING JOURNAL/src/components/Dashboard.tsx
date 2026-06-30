import React from 'react';
import { Trade } from '../types';
import { TrendingUp, TrendingDown, Award, Percent, BarChart3, Clock, ImageOff, HelpCircle, Calendar, Target, Edit, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  trades: Trade[];
  onOpenLightbox: (src: string) => void;
}

export default function Dashboard({ trades, onOpenLightbox }: DashboardProps) {
  // Daily Profit Target State
  const [dailyTarget, setDailyTarget] = React.useState<number>(() => {
    const saved = localStorage.getItem('mp_daily_target');
    return saved ? parseFloat(saved) : 500;
  });
  const [isEditingTarget, setIsEditingTarget] = React.useState(false);
  const [targetInput, setTargetInput] = React.useState(dailyTarget.toString());

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetInput);
    if (!isNaN(val) && val > 0) {
      setDailyTarget(val);
      localStorage.setItem('mp_daily_target', val.toString());
      setIsEditingTarget(false);
    } else {
      alert('Please enter a valid target amount greater than 0.');
    }
  };

  // Metrics calculation
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.status === 'Win').length;
  const losses = trades.filter((t) => t.status === 'Loss').length;
  const openTrades = trades.filter((t) => t.status === 'Open').length;
  const totalPnl = trades.reduce((acc, t) => acc + t.pnl, 0);
  
  const closedTradesCount = wins + losses;
  const winRate = closedTradesCount > 0 ? Math.round((wins / closedTradesCount) * 100) : 0;

  // Current calendar month profit/loss calculation
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (e.g. 5 is June in 2026)

  const currentMonthTrades = trades.filter((t) => {
    if (!t.date) return false;
    const parts = t.date.split('-');
    if (parts.length < 2) return false;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // convert 1-indexed to 0-indexed
    return year === currentYear && month === currentMonth;
  });

  const currentMonthPnl = currentMonthTrades.reduce((acc, t) => acc + t.pnl, 0);
  const currentMonthTradeCount = currentMonthTrades.length;
  const currentMonthName = now.toLocaleString('en-US', { month: 'long' });

  // Daily Profit Target calculations
  const todayString = now.toLocaleDateString('sv-SE'); // produces YYYY-MM-DD
  const todaysTrades = trades.filter((t) => t.date === todayString);
  const todaysPnl = todaysTrades.reduce((acc, t) => acc + t.pnl, 0);
  const progressPct = dailyTarget > 0 ? Math.min(100, Math.max(0, (todaysPnl / dailyTarget) * 100)) : 0;

  // Last 7 trades for P&L chart (reverse to chronological order)
  const last7Trades = [...trades].slice(0, 7).reverse();
  const maxPnlAbs = Math.max(...last7Trades.map((t) => Math.abs(t.pnl)), 100);

  // Helper for P&L color formatting
  const getPnlColorClass = (val: number) => {
    if (val > 0) return 'text-emerald-600 font-semibold';
    if (val < 0) return 'text-rose-600 font-semibold';
    return 'text-gray-500';
  };

  const getPnlBgClass = (val: number) => {
    if (val > 0) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (val < 0) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Total Trades</span>
            <div className="w-8 h-8 rounded-lg bg-primary-base/5 flex items-center justify-center text-primary-base">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary-base">{totalTrades}</div>
          <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>{openTrades} Active Open</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Win Rate</span>
            <div className="w-8 h-8 rounded-lg bg-accent-base/10 flex items-center justify-center text-accent-base">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${winRate >= 50 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {winRate}%
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            <span>Based on {wins} W / {losses} L (Closed)</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Total P&L</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${totalPnl >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {totalPnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Net return value
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Monthly P&L</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentMonthPnl >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${currentMonthPnl >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {currentMonthPnl >= 0 ? '+' : ''}${currentMonthPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
            <span className="capitalize">{currentMonthName} {currentYear}</span>
            <span className="bg-gray-100/80 text-[10px] font-mono font-bold text-primary-base px-1.5 py-0.5 rounded">
              {currentMonthTradeCount} Tr.
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">W / L Record</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary-base">
            <span className="text-emerald-600">{wins}</span>
            <span className="text-gray-300 mx-1.5">/</span>
            <span className="text-rose-500">{losses}</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Profit ratio factor
          </div>
        </motion.div>
      </div>

      {/* Daily Target Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-base/10 flex items-center justify-center text-accent-base">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-primary-base font-sans uppercase tracking-wider">
                🎯 Daily Profit Target
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingTarget ? (
              <div className="flex items-center gap-3 bg-bg-app border border-gray-200/50 px-3.5 py-1.5 rounded-xl">
                <span className="text-xs font-mono text-gray-500 font-bold uppercase">Target:</span>
                <span className="text-sm font-bold text-primary-base font-mono">${dailyTarget.toFixed(2)}</span>
                <button
                  onClick={() => {
                    setTargetInput(dailyTarget.toString());
                    setIsEditingTarget(true);
                  }}
                  className="p-1 hover:bg-gray-200/80 rounded text-gray-500 hover:text-primary-base transition-colors cursor-pointer flex items-center"
                  title="Adjust Daily Target"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveTarget} className="flex items-center gap-2 bg-bg-app border border-gray-200/80 px-2 py-1 rounded-xl">
                <span className="text-xs font-mono text-gray-500 font-semibold pl-1.5">$</span>
                <input
                  type="number"
                  step="any"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-20 px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono text-xs text-primary-base focus:outline-none focus:ring-1 focus:ring-accent-base"
                  placeholder="Target"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-cta-base hover:bg-cta-base/95 text-white font-mono text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  title="Save Target"
                >
                  <Check className="w-3 h-3" /> SAVE
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTarget(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer text-xs px-1.5"
                >
                  ✕
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Progress Bar & Description */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Today's Net P&L</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-2xl font-black font-mono tracking-tight ${todaysPnl >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {todaysPnl >= 0 ? '+' : ''}${todaysPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-gray-400 font-mono">/ ${dailyTarget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Goal Progress</span>
              <div className="text-lg font-extrabold text-primary-base font-mono mt-0.5">
                {Math.round(progressPct)}%
              </div>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200/40 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                todaysPnl >= dailyTarget 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/20' 
                  : todaysPnl > 0 
                    ? 'bg-gradient-to-r from-accent-base to-cta-base' 
                    : 'bg-gray-300'
              }`}
            />
          </div>

          {/* Contextual Guidance */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1 font-mono">
            {todaysPnl >= dailyTarget ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Profit target reached! Outstanding discipline and risk management today! 🏆
              </span>
            ) : todaysPnl > 0 ? (
              <span className="flex items-center gap-1">
                🏆 You are <strong className="text-primary-base font-bold">${(dailyTarget - todaysPnl).toFixed(2)}</strong> away from your daily goal. Trade mindfully!
              </span>
            ) : todaysPnl < 0 ? (
              <span className="text-rose-500 font-bold flex items-center gap-1">
                ⚠️ Drawdown of -${Math.abs(todaysPnl).toFixed(2)} today. Prioritize capital preservation & stick to your strategy!
              </span>
            ) : (
              <span className="flex items-center gap-1">
                📈 No closed trades logged today yet. Standard setups only, keep maximum discipline!
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* P&L last 7 trades */}
        <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-accent-base" />
            <h2 className="text-sm font-semibold text-primary-base font-sans uppercase tracking-wider">
              📈 P&L — Last 7 Trades
            </h2>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6 pb-2">
            {last7Trades.length > 0 ? (
              last7Trades.map((t, index) => {
                const percentage = Math.max(8, Math.round((Math.abs(t.pnl) / maxPnlAbs) * 100));
                const isProfit = t.pnl >= 0;
                const barColor = isProfit ? 'bg-emerald-500' : 'bg-rose-500';
                const assetLabel = t.pair.includes('XAU') ? 'Gold' : t.pair.includes('BTC') ? 'BTC' : t.pair.split(' ')[0];

                return (
                  <div key={t.id} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full mb-2 bg-primary-base text-white text-[11px] font-mono px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      {t.dir} {t.pair.split(' ')[0]}<br/>
                      {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                    </div>

                    <div className="w-full bg-gray-50 rounded-md flex flex-col justify-end h-[100px] overflow-hidden border border-gray-100">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className={`w-full ${barColor} rounded-t-sm`}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center mt-2 font-mono">
                      {assetLabel}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full flex flex-col items-center justify-center text-gray-400 py-10">
                <HelpCircle className="w-8 h-8 stroke-[1.25] mb-2" />
                <p className="text-xs">No trades logged yet!</p>
              </div>
            )}
          </div>
        </div>

        {/* Equity Curve SVG */}
        <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-500 text-sm">📈</span>
            <h2 className="text-sm font-semibold text-primary-base font-sans uppercase tracking-wider">
              Performance Curve
            </h2>
          </div>

          <div className="h-44 flex flex-col justify-center">
            {trades.length > 0 ? (
              (() => {
                // Generate cumulative balance starting from 0
                let currentBal = 0;
                const points = [...trades]
                  .reverse() // Chronological
                  .map((t) => {
                    currentBal += t.pnl;
                    return currentBal;
                  });
                
                const maxVal = Math.max(...points, 100);
                const minVal = Math.min(...points, -100);
                const range = maxVal - minVal;
                
                // Construct SVG points
                const width = 300;
                const height = 110;
                const svgPoints = points.map((val, i) => {
                  const x = (i / (points.length - 1 || 1)) * width;
                  const y = height - ((val - minVal) / (range || 1)) * height * 0.8 - height * 0.1;
                  return `${x},${y}`;
                }).join(' ');

                const areaPoints = `${svgPoints} ${width},${height} 0,${height}`;

                return (
                  <div className="w-full">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
                      <defs>
                        <linearGradient id="gradient-equity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Zero baseline */}
                      {minVal < 0 && maxVal > 0 && (
                        <line
                          x1="0"
                          y1={height - ((0 - minVal) / range) * height * 0.8 - height * 0.1}
                          x2={width}
                          y2={height - ((0 - minVal) / range) * height * 0.8 - height * 0.1}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          strokeDasharray="4"
                        />
                      )}
                      
                      {/* Filled area */}
                      <polygon points={areaPoints} fill="url(#gradient-equity)" />
                      
                      {/* Line path */}
                      <polyline
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="2"
                        points={svgPoints}
                      />
                      
                      {/* Dots */}
                      {points.map((val, i) => {
                        const x = (i / (points.length - 1 || 1)) * width;
                        const y = height - ((val - minVal) / (range || 1)) * height * 0.8 - height * 0.1;
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill="#0F172A"
                            stroke="#D4AF37"
                            strokeWidth="1.5"
                          />
                        );
                      })}
                    </svg>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 mt-3 font-mono">
                      <span>Start Balance: $0.00</span>
                      <span className="text-primary-base font-semibold">Net: {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center text-gray-400 py-10">
                <p className="text-xs">Cumulative equity curve displays here after you log trades.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Trades Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-base">🕐</span>
            <h2 className="text-sm font-semibold text-primary-base font-sans uppercase tracking-wider">
              Recent Trades
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {trades.slice(0, 5).length > 0 ? (
            trades.slice(0, 5).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between py-3.5 gap-4">
                <div className="flex items-center gap-3">
                  {trade.photo ? (
                    <img
                      src={trade.photo}
                      alt="chart"
                      onClick={() => onOpenLightbox(trade.photo!)}
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-85 transition-opacity"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-300">
                      <ImageOff className="w-4 h-4 stroke-[1.5]" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-primary-base font-mono">
                        {trade.pair.split(' ')[0]}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        trade.dir === 'Buy' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                      }`}>
                        {trade.dir === 'Buy' ? '▲ BUY' : '▼ SELL'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono mt-0.5 block">{trade.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    trade.status === 'Win' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : trade.status === 'Loss' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {trade.status === 'Win' ? 'Win' : trade.status === 'Loss' ? 'Loss' : 'Open'}
                  </span>

                  <span className={`text-sm font-bold font-mono min-w-[70px] text-right ${getPnlColorClass(trade.pnl)}`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-12">
              <p className="text-sm">No trades registered yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
