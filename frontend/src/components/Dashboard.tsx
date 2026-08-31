import React, { useState } from 'react';
import { X, Package, Store, Shield, DollarSign, TrendingUp, Users, CheckCircle, Clock, Truck, Eye } from 'lucide-react';
import { User, Order, SellerProfile } from '../types';

interface DashboardProps {
  user: User;
  onClose: () => void;
  orders: Order[];
  onTrackOrder: (o: Order) => void;
  sellerProfile: SellerProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onClose,
  orders,
  onTrackOrder,
  sellerProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'seller' | 'admin'>(
    user.role === 'ADMIN' ? 'admin' : user.role === 'SELLER' ? 'seller' : 'orders'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] my-auto p-6 lg:p-8 space-y-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-gold-gradient)] text-black font-extrabold text-lg flex items-center justify-center shadow-lg">
              {user.full_name ? user.full_name[0] : 'U'}
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-['Outfit']">{user.full_name}</h3>
              <div className="flex items-center gap-2">
                <span className="badge-gold">{user.role}</span>
                <span className="text-xs text-[var(--text-muted)]">{user.email}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-surface-elevated)]">
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex gap-2 border-b border-[var(--border-subtle)] pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md'
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> My Orders ({orders.length})
          </button>

          {(user.role === 'SELLER' || user.role === 'ADMIN') && (
            <button
              onClick={() => setActiveTab('seller')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'seller'
                  ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" /> Seller Store Portal
            </button>
          )}

          {user.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" /> System Admin Hub
            </button>
          )}
        </div>

        {/* TAB 1: My Orders */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)] space-y-2">
                <Package className="w-12 h-12 mx-auto opacity-30 text-[var(--accent-gold)]" />
                <p>No orders placed yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-['Outfit']">#{order.order_number}</span>
                      <span className="badge-dark">{order.status}</span>
                      <span className="text-xs text-[var(--text-muted)]">{order.created_at}</span>
                    </div>

                    <div className="text-xs text-[var(--text-secondary)]">
                      {order.items.map(i => i.product_title).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-base gold-text font-['Outfit']">
                      ${order.total_amount.toFixed(2)}
                    </span>

                    <button
                      onClick={() => onTrackOrder(order)}
                      className="btn-gold !py-1.5 !px-3.5 !text-xs"
                    >
                      <Truck className="w-3.5 h-3.5 text-black" />
                      Track Package
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Seller Portal */}
        {activeTab === 'seller' && (
          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 space-y-1">
                <span className="text-xs text-[var(--text-muted)] font-bold">STORE NAME</span>
                <h4 className="font-bold text-base">{sellerProfile.store_name}</h4>
                <span className="badge-gold text-[10px]">Approved Partner</span>
              </div>

              <div className="glass-card p-4 space-y-1">
                <span className="text-xs text-[var(--text-muted)] font-bold">TOTAL SALES REVENUE</span>
                <h4 className="font-extrabold text-xl gold-text font-['Outfit']">
                  ${sellerProfile.total_sales.toLocaleString()}
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold">+18.4% this month</span>
              </div>

              <div className="glass-card p-4 space-y-1">
                <span className="text-xs text-[var(--text-muted)] font-bold">STORE RATING</span>
                <h4 className="font-extrabold text-xl font-['Outfit'] flex items-center gap-1 text-[var(--accent-gold)]">
                  ★ {sellerProfile.rating} / 5.0
                </h4>
                <span className="text-[10px] text-[var(--text-muted)]">Commission Rate: {sellerProfile.commission_rate}%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Admin Hub */}
        {activeTab === 'admin' && (
          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <span className="text-xs text-[var(--text-muted)] font-bold">PLATFORM GMV</span>
                <h4 className="text-2xl font-extrabold gold-text font-['Outfit']">$482,900</h4>
              </div>

              <div className="glass-card p-4">
                <span className="text-xs text-[var(--text-muted)] font-bold">ACTIVE USERS</span>
                <h4 className="text-2xl font-extrabold font-['Outfit']">14,280</h4>
              </div>

              <div className="glass-card p-4">
                <span className="text-xs text-[var(--text-muted)] font-bold">APPROVED SELLERS</span>
                <h4 className="text-2xl font-extrabold font-['Outfit']">48</h4>
              </div>

              <div className="glass-card p-4">
                <span className="text-xs text-[var(--text-muted)] font-bold">TOTAL ORDERS</span>
                <h4 className="text-2xl font-extrabold font-['Outfit'] font-['Outfit']">3,490</h4>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
