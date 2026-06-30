import React, { useState, useEffect } from 'react';
import { Trade, TradingNote } from './types';
import LockScreen from './components/LockScreen';
import Dashboard from './components/Dashboard';
import AddTradeForm from './components/AddTradeForm';
import TradesList from './components/TradesList';
import PhotosGallery from './components/PhotosGallery';
import NotesList from './components/NotesList';
import { LayoutDashboard, Receipt, Image, FileText, LogOut, X, AlertTriangle, Eye, ShieldAlert, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Default mock data is set to empty to clear all initial data
const DEFAULT_TRADES: Trade[] = [];

const DEFAULT_NOTES: TradingNote[] = [];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'journal' | 'gallery' | 'notes'>('stats');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [notes, setNotes] = useState<TradingNote[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Load from local storage on mount - cleared to completely wipe all information
  useEffect(() => {
    localStorage.removeItem('mp_trades_v2');
    localStorage.removeItem('mp_notes_v2');
    localStorage.removeItem('mp_daily_target');
    setTrades([]);
    setNotes([]);

    // Auto unlock in development if preferred, or maintain standard flow
    const savedAuth = sessionStorage.getItem('mp_auth_session');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync state to local storage on changes
  const saveTradesToStorage = (updatedTrades: Trade[]) => {
    setTrades(updatedTrades);
    localStorage.setItem('mp_trades_v2', JSON.stringify(updatedTrades));
  };

  const saveNotesToStorage = (updatedNotes: TradingNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('mp_notes_v2', JSON.stringify(updatedNotes));
  };

  const handleUnlock = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('mp_auth_session', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mp_auth_session');
  };

  const handleClearAllData = () => {
    if (confirm('Are you absolutely sure you want to clear all trades, screenshots, and notes? This action is permanent and cannot be undone.')) {
      setTrades([]);
      setNotes([]);
      localStorage.removeItem('mp_trades_v2');
      localStorage.removeItem('mp_notes_v2');
    }
  };

  // Trade management operations
  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    const tradeWithId: Trade = {
      ...newTrade,
      id: Date.now(),
    };
    const updatedTrades = [tradeWithId, ...trades];
    saveTradesToStorage(updatedTrades);
    setIsAddFormOpen(false);
  };

  const handleDeleteTrade = (id: number) => {
    const updatedTrades = trades.filter((t) => t.id !== id);
    saveTradesToStorage(updatedTrades);
  };

  // Note management operations
  const handleAddNote = (text: string) => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const newNote: TradingNote = {
      id: Date.now(),
      text,
      date: dateStr,
    };
    const updatedNotes = [newNote, ...notes];
    saveNotesToStorage(updatedNotes);
  };

  const handleDeleteNote = (id: number) => {
    const updatedNotes = notes.filter((n) => n.id !== id);
    saveNotesToStorage(updatedNotes);
  };

  if (!isAuthenticated) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-bg-app text-text-main pb-16 font-sans relative">
      {/* Decorative grid pattern lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Elegant Minimalist Header */}
        <header className="pt-8 pb-6 border-b border-gray-200/60 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💀</span>
              <h1 className="text-xl font-extrabold tracking-tight text-primary-base font-sans">
                MARKET PREDATOR
              </h1>
            </div>
            <p className="text-xs text-gray-500 font-mono tracking-wide uppercase mt-0.5">
              Elite Trading Journal & Portfolio Dashboard v2
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded-md font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SECURED LIVE
            </span>

            <button
              onClick={handleClearAllData}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/30 rounded-xl text-xs font-bold font-mono tracking-wide transition-all cursor-pointer flex items-center gap-1.5"
              title="Wipe all trade logs & notes database"
            >
              <Trash2 className="w-3.5 h-3.5" /> CLEAR DATA
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-gray-200/80 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-bold font-mono text-gray-500 tracking-wide transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> LOGOUT
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 bg-white/70 backdrop-blur-md border border-gray-200/80 p-1.5 rounded-2xl mb-6 shadow-sm overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'stats'
                  ? 'bg-primary-base text-white shadow-md'
                  : 'text-gray-400 hover:text-primary-base hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>DASHBOARD</span>
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'journal'
                  ? 'bg-primary-base text-white shadow-md'
                  : 'text-gray-400 hover:text-primary-base hover:bg-gray-50'
              }`}
            >
              <Receipt className="w-4 h-4 shrink-0" />
              <span>TRADES</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'bg-primary-base text-white shadow-md'
                  : 'text-gray-400 hover:text-primary-base hover:bg-gray-50'
              }`}
            >
              <Image className="w-4 h-4 shrink-0" />
              <span>PHOTOS</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-primary-base text-white shadow-md'
                  : 'text-gray-400 hover:text-primary-base hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>NOTES</span>
            </button>
          </div>
        </div>

        {/* Active Content Body */}
        <main className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'stats' && (
                <Dashboard
                  trades={trades}
                  onOpenLightbox={(src) => setLightboxSrc(src)}
                />
              )}

              {activeTab === 'journal' && (
                <div className="space-y-4">
                  <AnimatePresence>
                    {isAddFormOpen && (
                      <AddTradeForm
                        onAdd={handleAddTrade}
                        onCancel={() => setIsAddFormOpen(false)}
                      />
                    )}
                  </AnimatePresence>

                  <TradesList
                    trades={trades}
                    onDeleteTrade={handleDeleteTrade}
                    onOpenLightbox={(src) => setLightboxSrc(src)}
                    onTriggerAddForm={() => setIsAddFormOpen(!isAddFormOpen)}
                    isAddFormOpen={isAddFormOpen}
                  />
                </div>
              )}

              {activeTab === 'gallery' && (
                <PhotosGallery
                  trades={trades}
                  onOpenLightbox={(src) => setLightboxSrc(src)}
                  onDeleteTrade={handleDeleteTrade}
                />
              )}

              {activeTab === 'notes' && (
                <NotesList
                  notes={notes}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Lightbox / High-definition Fullscreen Preview modal */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSrc(null)}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxSrc}
              alt="Expanded view"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-gray-800"
            />

            <span className="text-gray-400 text-xs font-mono mt-4 tracking-wide uppercase">
              Click anywhere to close full preview
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
