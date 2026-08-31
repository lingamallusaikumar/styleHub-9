import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Bell, User as UserIcon, Moon, Sun, Sparkles, SlidersHorizontal, Zap } from 'lucide-react';
import { Category, NotificationItem } from '../types';

interface NavbarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  notifications: NotificationItem[];
  user: any;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeView: 'store' | 'api';
  onToggleApiPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  notifications,
  user,
  onOpenAuth,
  onOpenDashboard,
  theme,
  onToggleTheme,
  activeView,
  onToggleApiPortal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-[var(--border-subtle)] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          onClick={() => onSelectCategory('all')} 
          className="cursor-pointer flex items-center gap-2 group select-none"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--accent-gold-gradient)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-wider font-['Outfit'] gold-text">STYLEHUB</span>
            <span className="text-[10px] block font-semibold text-[var(--text-muted)] tracking-widest uppercase -mt-1">Luxury Fashion</span>
          </div>
        </div>

        {/* Categories Desktop & API Portal Toggle */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-surface)] p-1.5 rounded-full border border-[var(--border-subtle)]">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                if (activeView === 'api') onToggleApiPortal();
                onSelectCategory(cat.slug);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeView === 'store' && selectedCategory === cat.slug
                  ? 'bg-[var(--accent-gold-gradient)] text-black font-bold shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={onToggleApiPortal}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 ${
              activeView === 'api'
                ? 'bg-amber-400 text-black shadow-lg scale-105'
                : 'text-[var(--accent-gold)] border border-[var(--accent-gold-glow)] hover:bg-[var(--accent-gold-glow)]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            API Portal
          </button>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Live Search Input */}
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search cashmere, leather..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full pl-9 pr-4 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-2xl z-50 animate-fade-in border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between mb-3 border-b border-[var(--border-subtle)] pb-2">
                  <h4 className="font-bold text-sm">Notifications</h4>
                  <span className="badge-gold">{notifications.length} alerts</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs">
                      <div className="font-bold text-[var(--accent-gold)] mb-0.5">{n.title}</div>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-[var(--text-muted)] mt-1 block">{n.created_at}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent-gold)] text-black font-bold text-[10px] rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="btn-gold !py-1.5 !px-3.5 !text-xs"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-black/20 text-black px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ml-1">
              {cartCount}
            </span>
          </button>

          {/* Account Profile / Auth */}
          {user ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 p-1.5 rounded-full border border-[var(--accent-gold)] bg-[var(--glass-bg)] hover:bg-[var(--bg-surface)] transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--accent-gold-gradient)] text-black font-bold text-xs flex items-center justify-center">
                {user.full_name ? user.full_name[0] : 'U'}
              </div>
              <span className="text-xs font-bold hidden xl:inline pr-1">{user.full_name?.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
              title="Sign In / Register"
            >
              <UserIcon className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
