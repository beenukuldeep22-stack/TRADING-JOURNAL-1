import React, { useState } from 'react';
import { Trade } from '../types';
import { Search, SlidersHorizontal, ImageOff, Trash2, ArrowUpDown, ChevronDown, ChevronUp, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TradesListProps {
  trades: Trade[];
  onDeleteTrade: (id: number) => void;
  onOpenLightbox: (src: string) => void;
  onTriggerAddForm: () => void;
  isAddFormOpen: boolean;
}

type SortField = 'date' | 'pnl' | 'lots';
type SortOrder = 'asc' | 'desc';

export default function TradesList({
  trades,
  onDeleteTrade,
  onOpenLightbox,
  onTriggerAddForm,
  isAddFormOpen,
}: TradesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dirFilter, setDirFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedTradeId, setExpandedTradeId] = useState<number | null>(null);

  // Toggle expanded details
  const toggleExpand = (id: number) => {
    setExpandedTradeId(expandedTradeId === id ? null : id);
  };

  // Toggle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filtering & Sorting Logic
  const filteredTrades = trades
    .filter((t) => {
      const matchesSearch =
        t.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.note.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesDir = dirFilter === 'All' || t.dir === dirFilter;

      return matchesSearch && matchesStatus && matchesDir;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'pnl') {
        comparison = a.pnl - b.pnl;
      } else if (sortField === 'lots') {
        comparison = a.lots - b.lots;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const getPnlColorClass = (val: number) => {
    if (val > 0) return 'text-emerald-600 font-bold';
    if (val < 0) return 'text-rose-600 font-bold';
    return 'text-gray-500 font-medium';
  };

  return (
    <div className="space-y-4">
      {/* List Header Controls */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h2 className="text-sm font-semibold text-primary-base font-sans uppercase tracking-wider">
              All Trades Log
            </h2>
            <span className="bg-gray-100 text-primary-base text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
              {filteredTrades.length}
            </span>
          </div>

          <button
            onClick={onTriggerAddForm}
            className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              isAddFormOpen
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                : 'bg-cta-base text-white hover:bg-cta-base/95 shadow-md shadow-cta-base/10'
            }`}
          >
            {isAddFormOpen ? 'Cancel' : '＋ Add Trade'}
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-gray-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by pair or thesis details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-sans"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-sans"
            >
              <option value="All">All Statuses</option>
              <option value="Win">✅ Wins Only</option>
              <option value="Loss">❌ Losses Only</option>
              <option value="Open">🔵 Open Only</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={dirFilter}
              onChange={(e) => setDirFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-sans"
            >
              <option value="All">All Directions</option>
              <option value="Buy">▲ Buy Logs</option>
              <option value="Sell">▼ Sell Logs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trades Table/Cards */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
        {/* Sorting Column Headers (Desktop-only Table Header) */}
        <div className="hidden md:grid grid-cols-12 gap-2 bg-gray-50/70 border-b border-gray-100 px-6 py-3 text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider">
          <div className="col-span-3 flex items-center gap-1">Asset Info</div>
          <div className="col-span-2 flex items-center gap-1">Direction</div>
          <div className="col-span-1 flex items-center gap-1">Status</div>
          <div className="col-span-1 flex items-center justify-end gap-1 cursor-pointer hover:text-primary-base select-none" onClick={() => handleSort('lots')}>
            Lots {sortField === 'lots' && (sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
          </div>
          <div className="col-span-2 flex items-center justify-center gap-1 cursor-pointer hover:text-primary-base select-none" onClick={() => handleSort('date')}>
            Date {sortField === 'date' && (sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
          </div>
          <div className="col-span-2 flex items-center justify-end gap-1 cursor-pointer hover:text-primary-base select-none" onClick={() => handleSort('pnl')}>
            Net P&L {sortField === 'pnl' && (sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
          </div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {/* Trade Logs List */}
        <div className="divide-y divide-gray-100">
          <AnimatePresence initial={false}>
            {filteredTrades.length > 0 ? (
              filteredTrades.map((trade) => {
                const isExpanded = expandedTradeId === trade.id;

                return (
                  <motion.div
                    key={trade.id}
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group"
                  >
                    {/* Main Row layout (Desktop table, mobile cards) */}
                    <div className="flex flex-col md:grid md:grid-cols-12 md:gap-2 items-start md:items-center px-5 py-4 md:px-6 md:py-3.5 gap-3 md:gap-0 hover:bg-gray-50/40 transition-colors">
                      {/* Asset & Photo thumbnail */}
                      <div className="col-span-3 flex items-center gap-3 w-full md:w-auto">
                        {trade.photo ? (
                          <img
                            src={trade.photo}
                            alt="chart"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenLightbox(trade.photo!);
                            }}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-85 transition-opacity shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-300 shrink-0">
                            <ImageOff className="w-4 h-4 stroke-[1.5]" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <span className="font-extrabold text-sm text-primary-base font-mono block truncate">
                            {trade.pair}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono md:hidden">{trade.date}</span>
                        </div>

                        {/* Mobile expansion/arrow indicator */}
                        <button
                          onClick={() => toggleExpand(trade.id)}
                          className="md:hidden ml-auto p-1 text-gray-400 hover:text-primary-base rounded-lg cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Direction */}
                      <div className="col-span-2 flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          trade.dir === 'Buy' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                        }`}>
                          {trade.dir === 'Buy' ? '▲ BUY' : '▼ SELL'}
                        </span>
                        {trade.lots > 0 && (
                          <span className="text-xs text-gray-500 font-mono font-medium md:hidden">
                            {trade.lots} Lots
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          trade.status === 'Win' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : trade.status === 'Loss' 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {trade.status === 'Win' ? 'Win' : trade.status === 'Loss' ? 'Loss' : 'Open'}
                        </span>
                      </div>

                      {/* Lots (Desktop) */}
                      <div className="col-span-1 hidden md:block text-right font-mono text-xs font-semibold text-gray-600 pr-2">
                        {trade.lots > 0 ? `${trade.lots.toFixed(2)}` : '—'}
                      </div>

                      {/* Date (Desktop) */}
                      <div className="col-span-2 hidden md:block text-center font-mono text-xs text-gray-500">
                        {trade.date}
                      </div>

                      {/* P&L */}
                      <div className="col-span-2 flex md:justify-end items-center justify-between w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                        <span className="text-xs text-gray-400 font-medium md:hidden">Net P&L:</span>
                        <span className={`text-sm font-mono tracking-tight ${getPnlColorClass(trade.pnl)}`}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Actions & Expanded Control */}
                      <div className="col-span-1 flex items-center justify-end md:justify-center gap-2 w-full md:w-auto">
                        <button
                          onClick={() => toggleExpand(trade.id)}
                          className="hidden md:inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-primary-base hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="View thesis details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Is trade ko permanent delete karein?')) {
                              onDeleteTrade(trade.id);
                            }
                          }}
                          className="inline-flex items-center justify-center p-1.5 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete trade"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details Container */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50/60 border-t border-b border-gray-100 px-6 py-5 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          {/* Left Column: Stats & Notes */}
                          <div className={`md:col-span-7 space-y-3 ${trade.photo ? '' : 'md:col-span-12'}`}>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-mono text-gray-500 pb-2 border-b border-gray-100/80">
                              <div>
                                Entry: <span className="font-bold text-primary-base">{trade.entry || '—'}</span>
                              </div>
                              <div>
                                Exit: <span className="font-bold text-primary-base">{trade.exit || '—'}</span>
                              </div>
                              <div>
                                Lots: <span className="font-bold text-primary-base">{trade.lots || '—'}</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-1">
                                Strategy Confluence & Retrospective Notes
                              </h4>
                              {trade.note ? (
                                <p className="text-sm text-gray-700 leading-relaxed font-sans bg-white border border-gray-100 p-3.5 rounded-xl whitespace-pre-line shadow-sm">
                                  {trade.note}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-400 italic bg-white/40 border border-dashed border-gray-200 p-3 rounded-xl">
                                  No strategy analysis recorded for this trade.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Column: Chart Image preview */}
                          {trade.photo && (
                            <div className="md:col-span-5 flex flex-col justify-center">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-1.5">
                                Live Chart Setup Screenshot
                              </h4>
                              <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                <img
                                  src={trade.photo}
                                  alt="Trade diagram setup"
                                  className="w-full h-36 object-cover cursor-zoom-in group-hover:scale-[1.03] transition-transform duration-200"
                                  onClick={() => onOpenLightbox(trade.photo!)}
                                />
                                <div className="absolute inset-0 bg-primary-base/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <span className="text-white text-[11px] font-bold font-mono bg-primary-base/80 px-2 py-1 rounded">
                                    Click to Enlarge 📸
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center text-gray-400 py-16 px-4">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto stroke-[1.25] mb-2.5" />
                <h3 className="text-sm font-semibold text-primary-base mb-1">No matching logs found</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Try adjusting search parameters, filtering, or log a brand new trade using the "Add Trade" button.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
