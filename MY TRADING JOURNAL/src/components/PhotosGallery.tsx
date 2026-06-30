import React from 'react';
import { Trade } from '../types';
import { Image, ImageOff, Trash2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PhotosGalleryProps {
  trades: Trade[];
  onOpenLightbox: (src: string) => void;
  onDeleteTrade: (id: number) => void;
}

export default function PhotosGallery({ trades, onOpenLightbox, onDeleteTrade }: PhotosGalleryProps) {
  // Filter only trades that have a photo
  const tradesWithPhotos = trades.filter((t) => t.photo);

  const getPnlColorClass = (val: number) => {
    if (val > 0) return 'text-emerald-500 font-bold';
    if (val < 0) return 'text-rose-500 font-bold';
    return 'text-gray-400';
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📸</span>
        <h2 className="text-sm font-semibold text-primary-base font-sans uppercase tracking-wider">
          Screenshot Chart Gallery
        </h2>
        <span className="bg-gray-100 text-primary-base text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
          {tradesWithPhotos.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {tradesWithPhotos.length > 0 ? (
            tradesWithPhotos.map((trade) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onOpenLightbox(trade.photo!)}
              >
                {/* Image element */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={trade.photo!}
                    alt={`${trade.pair} setup`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* Action overlays */}
                  <div className="absolute inset-0 bg-primary-base/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/95 p-1.5 rounded-lg shadow-md text-primary-base">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Is trade ko complete delete karein jisse screenshot bhi hat jaye?')) {
                        onDeleteTrade(trade.id);
                      }
                    }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-rose-600/90 text-white p-1.5 rounded-lg transition-colors shadow"
                    title="Delete trade logs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info block */}
                <div className="p-3 bg-white border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-primary-base font-mono truncate">
                      {trade.pair.split(' ')[0]}
                    </span>
                    <span className={`text-xs font-mono font-bold ${getPnlColorClass(trade.pnl)}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400 font-mono">
                    <span>{trade.dir === 'Buy' ? '▲ Buy' : '▼ Sell'}</span>
                    <span>{trade.date}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-16 px-4">
              <ImageOff className="w-12 h-12 text-gray-300 mx-auto stroke-[1.25] mb-2" />
              <h3 className="text-sm font-semibold text-primary-base">No Photos Logged</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                Aapne abhi tak koi trade screenshot upload nahi kiya. Naya trade log karte waqt chart image add karein! 📸
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
