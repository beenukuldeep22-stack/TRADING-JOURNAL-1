import React, { useState } from 'react';
import { TradingNote } from '../types';
import { Trash2, AlertCircle, FileText, Check, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotesListProps {
  notes: TradingNote[];
  onAddNote: (text: string) => void;
  onDeleteNote: (id: number) => void;
}

export default function NotesList({ notes, onAddNote, onDeleteNote }: NotesListProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    onAddNote(newNoteText.trim());
    setNewNoteText('');
    setIsNoteFormOpen(false);
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Notes header & controls */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h2 className="text-sm font-semibold text-primary-base font-sans uppercase tracking-wider">
              Trading Notes & Lessons
            </h2>
            <span className="bg-gray-100 text-primary-base text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
              {filteredNotes.length}
            </span>
          </div>

          <button
            onClick={() => setIsNoteFormOpen(!isNoteFormOpen)}
            className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              isNoteFormOpen
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                : 'bg-cta-base text-white hover:bg-cta-base/95 shadow-md shadow-cta-base/10'
            }`}
          >
            {isNoteFormOpen ? 'Cancel' : '＋ Add Note'}
          </button>
        </div>

        {/* Search */}
        <div className="relative pt-2 border-t border-gray-100">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes and key lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-sans"
          />
        </div>
      </div>

      {/* Add note form */}
      <AnimatePresence>
        {isNoteFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 font-mono tracking-wider uppercase mb-1.5">
                  Write Strategy, Psychology & Retrospective Lessons
                </label>
                <textarea
                  placeholder="Record your psychological state, lessons learned from wins/losses, or overall market insights..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-base/15 focus:border-accent-base transition-all font-sans resize-y"
                  required
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cta-base hover:bg-cta-base/95 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-md shadow-cta-base/10 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Lesson
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsNoteFormOpen(false);
                    setNewNoteText('');
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200/85 text-primary-base text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes list */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout="position"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <p className="text-sm text-gray-700 font-sans leading-relaxed whitespace-pre-line flex-1">
                    {note.text}
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Is note ko delete karein?')) {
                        onDeleteNote(note.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono font-semibold pt-2 border-t border-gray-50 uppercase tracking-wider">
                  <span>📅</span>
                  <span>Registered: {note.date}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-16 bg-white border border-gray-200/80 rounded-2xl p-5">
              <FileText className="w-10 h-10 text-gray-300 mx-auto stroke-[1.25] mb-2.5" />
              <h3 className="text-sm font-semibold text-primary-base">No notes logged</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-0.5">
                Keep notes of psychology, confluences, and strategy rules to build discipline. Click "Add Note" to write one.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
