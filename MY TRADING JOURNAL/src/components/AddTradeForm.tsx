import React, { useState, useEffect } from 'react';
import { Trade } from '../types';
import { Camera, ImageOff, Plus, Trash, Check, X, FileUp } from 'lucide-react';
import { motion } from 'motion/react';

interface AddTradeFormProps {
  onAdd: (trade: Omit<Trade, 'id'>) => void;
  onCancel: () => void;
}

export default function AddTradeForm({ onAdd, onCancel }: AddTradeFormProps) {
  const [pair, setPair] = useState('XAUUSD (Gold)');
  const [customPair, setCustomPair] = useState('');
  const [dir, setDir] = useState<'Buy' | 'Sell'>('Buy');
  const [entry, setEntry] = useState('');
  const [exit, setExit] = useState('');
  const [lots, setLots] = useState('');
  const [date, setDate] = useState('');
  const [pnl, setPnl] = useState('');
  const [status, setStatus] = useState<'Win' | 'Loss' | 'Open'>('Win');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    // Set default date as today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert('Please select a date.');
      return;
    }

    const finalPair = pair === 'Other' ? customPair.trim() || 'Other' : pair;

    onAdd({
      pair: finalPair,
      dir,
      entry: parseFloat(entry) || 0,
      exit: parseFloat(exit) || 0,
      lots: parseFloat(lots) || 0,
      date,
      pnl: parseFloat(pnl) || 0,
      status,
      note,
      photo,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-md mb-6 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
        <h3 className="font-bold text-base text-primary-base flex items-center gap-2">
          <span className="text-cta-base text-lg">＋</span> Add New Trade Log
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-primary-base p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Pair and Direction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">Asset / Pair</label>
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-sans"
            >
              <option value="XAUUSD (Gold)">XAUUSD (Gold)</option>
              <option value="BTCUSD (Bitcoin)">BTCUSD (Bitcoin)</option>
              <option value="EURUSD (Euro)">EURUSD (Euro / US Dollar)</option>
              <option value="GBPUSD (Pound)">GBPUSD (Pound / US Dollar)</option>
              <option value="Other">Other (Custom Asset...)</option>
            </select>

            {pair === 'Other' && (
              <motion.input
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                type="text"
                placeholder="Enter custom pair e.g. ETHUSD, USDJPY"
                value={customPair}
                onChange={(e) => setCustomPair(e.target.value)}
                className="w-full mt-2 px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-sans"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">Trade Direction</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDir('Buy')}
                className={`py-2.5 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all cursor-pointer ${
                  dir === 'Buy'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                }`}
              >
                ▲ BUY / LONG
              </button>
              <button
                type="button"
                onClick={() => setDir('Sell')}
                className={`py-2.5 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all cursor-pointer ${
                  dir === 'Sell'
                    ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                }`}
              >
                ▼ SELL / SHORT
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Entry and Exit Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">Entry Price</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 2340.50"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">Exit Price</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 2355.20"
              value={exit}
              onChange={(e) => setExit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-mono"
            />
          </div>
        </div>

        {/* Row 3: Lots and Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">Lot Size</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 0.10"
              value={lots}
              onChange={(e) => setLots(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">Trade Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-mono"
              required
            />
          </div>
        </div>

        {/* Row 4: P&L ($) and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">Net P&L ($)</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 250.00 or -120.00"
              value={pnl}
              onChange={(e) => setPnl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">Result Status</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Win')}
                className={`py-2.5 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all cursor-pointer ${
                  status === 'Win'
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                }`}
              >
                ✅ WIN
              </button>
              <button
                type="button"
                onClick={() => setStatus('Loss')}
                className={`py-2.5 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all cursor-pointer ${
                  status === 'Loss'
                    ? 'bg-rose-100 border-rose-400 text-rose-800'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                }`}
              >
                ❌ LOSS
              </button>
              <button
                type="button"
                onClick={() => setStatus('Open')}
                className={`py-2.5 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all cursor-pointer ${
                  status === 'Open'
                    ? 'bg-blue-100 border-blue-400 text-blue-800'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                }`}
              >
                🔵 OPEN
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">Strategy / Notes</label>
          <textarea
            placeholder="Describe your trading thesis, entry triggers, confluence factors, etc..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-24 px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-sans resize-y"
          />
        </div>

        {/* Screenshot Upload */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">
            📸 Trade Chart Screenshot (Optional)
          </label>

          {!photo ? (
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl hover:border-accent-base transition-colors duration-200 p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50/30">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileUp className="w-8 h-8 text-accent-base mb-2 stroke-[1.5]" />
              <span className="text-sm font-semibold text-primary-base">Click or Drag & Drop to upload</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG or JPEG chart layouts</span>
            </div>
          ) : (
            <div className="relative inline-block mt-1">
              <img
                src={photo}
                alt="preview"
                className="max-h-48 rounded-xl object-cover border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-2.5 -right-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold p-1.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-cta-base hover:bg-cta-base/95 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-md hover:shadow-cta-base/10 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Trade Log
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200/85 text-primary-base text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
