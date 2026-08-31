import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { ApiService } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('shopper@example.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await ApiService.login(email, password);
      setLoading(false);
      onLoginSuccess(res.user);
      onClose();
    } catch {
      setLoading(false);
    }
  };

  const setDemoRole = (role: 'shopper' | 'seller' | 'admin') => {
    if (role === 'shopper') setEmail('shopper@example.com');
    if (role === 'seller') setEmail('seller@auramilano.com');
    if (role === 'admin') setEmail('admin@stylehub.com');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] p-6 lg:p-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--accent-gold)]" />
            <h3 className="text-xl font-extrabold font-['Outfit']">Sign In to STYLEHUB</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-surface-elevated)]">
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Demo Quick-Role Switcher */}
        <div className="space-y-2">
          <label className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">
            Select Demo Persona:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoRole('shopper')}
              className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                email.includes('shopper') ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              Shopper
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('seller')}
              className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                email.includes('seller') ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('admin')}
              className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                email.includes('admin') ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-[var(--text-muted)] font-bold block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] font-bold block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold !py-3 !justify-center shadow-xl"
          >
            {loading ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

      </div>
    </div>
  );
};
