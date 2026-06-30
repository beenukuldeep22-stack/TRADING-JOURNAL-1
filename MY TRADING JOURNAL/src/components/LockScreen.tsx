import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const CORRECT_PASSWORD = 'Akshitbohra37@';

  const handleUnlock = () => {
    if (password === CORRECT_PASSWORD) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-app p-4">
      {/* Decorative background grid elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-gray-200/80 rounded-2xl p-8 shadow-xl relative overflow-hidden"
      >
        {/* Subtle accent color bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent-base" />

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-primary-base/5 flex items-center justify-center text-accent-base mb-5 border border-primary-base/10 shadow-sm">
            <Lock className="w-6 h-6 stroke-[1.75]" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-primary-base font-sans">
            MARKET PREDATOR
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-wider uppercase mt-1 mb-6">
            Trading Journal — Private & Secured
          </p>

          <div className="w-full space-y-4">
            <div className="relative">
              <input
                id="pw-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-primary-base font-sans text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-accent-base/20 focus:border-accent-base transition-all duration-200"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-base transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-1.5 text-red-600 text-sm font-medium"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Wrong password. Try again.</span>
              </motion.div>
            )}

            <button
              onClick={handleUnlock}
              className="w-full py-3 bg-cta-base hover:bg-cta-base/95 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-cta-base/15 cursor-pointer flex items-center justify-center gap-2"
            >
              Unlock Journal
            </button>
          </div>

          <div className="mt-8 text-[11px] text-gray-400 font-mono">
            SECURE SESSION • LOCAL DATA STORAGE
          </div>
        </div>
      </motion.div>
    </div>
  );
}
