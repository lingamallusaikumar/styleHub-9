import React, { useState } from 'react';
import { X, TrendingUp, Package, DollarSign, AlertTriangle, CheckCircle, RefreshCw, Layers } from 'lucide-react';
import { SellerProfile, Product } from '../types';

interface VendorErpDashboardProps {
  sellerProfile: SellerProfile;
  products: Product[];
  onClose: () => void;
}

export const VendorErpDashboard: React.FC<VendorErpDashboardProps> = ({
  sellerProfile,
  products,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'payouts'>('analytics');
  const [payoutRequested, setPayoutRequested] = useState(false);

  const totalRevenue = 42890.00;
  const pendingPayout = 12450.00;
  const totalOrdersCount = 184;

  const lowStockVariants = products.flatMap(p => 
    (p.variants || []).filter(v => v.stock_quantity <= 10).map(v => ({ productTitle: p.title, ...v }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-[var(--accent-gold)] max-h-[90vh] flex flex-col my-auto text-[var(--text-primary)]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[var(--accent-gold-gradient)] text-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold font-['Outfit'] gold-text">
                  {sellerProfile.store_name} ERP Portal
                </h2>
                <span className="badge-gold text-[10px]">VERIFIED MERCHANT</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Multi-warehouse stock inventory, commission tracking & payouts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Bar */}
        <div className="px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'analytics' ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            📊 Sales & Revenue Analytics
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'inventory' ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Inventory & Stock ({lowStockVariants.length} Low)
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'payouts' ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Merchant Payouts
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-4 border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-semibold mb-2">
                    <span>TOTAL GROSS REVENUE</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold font-['Outfit'] gold-text">${totalRevenue.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">+18.4% vs last month</span>
                </div>

                <div className="glass-card p-4 border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-semibold mb-2">
                    <span>TOTAL ORDERS FULFILLED</span>
                    <Package className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-extrabold font-['Outfit']">{totalOrdersCount}</div>
                  <span className="text-[10px] text-[var(--text-muted)] mt-1 inline-block">Avg $233.10 / order</span>
                </div>

                <div className="glass-card p-4 border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-semibold mb-2">
                    <span>MERCHANT COMMISSION</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold font-['Outfit']">{sellerProfile.commission_rate || 12}%</div>
                  <span className="text-[10px] text-[var(--text-muted)] mt-1 inline-block">Platform Tier: Gold Merchant</span>
                </div>
              </div>

              {/* Performance Table */}
              <div className="glass-card p-5 border border-[var(--border-subtle)] space-y-3">
                <h4 className="font-bold text-sm font-['Outfit'] gold-text">Top Performing Products</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                      <tr>
                        <th className="py-2">Product Title</th>
                        <th className="py-2">Base Price</th>
                        <th className="py-2">Views</th>
                        <th className="py-2">Rating</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {products.slice(0, 5).map(p => (
                        <tr key={p.id} className="hover:bg-[var(--bg-surface)]">
                          <td className="py-2.5 font-bold">{p.title}</td>
                          <td className="py-2.5">${Number(p.base_price).toFixed(2)}</td>
                          <td className="py-2.5">{p.view_count || 140}</td>
                          <td className="py-2.5 text-[var(--accent-gold)]">★ {p.avg_rating || 4.8}</td>
                          <td className="py-2.5"><span className="text-emerald-400 font-bold">Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm font-['Outfit']">Stock Alert & Reorder Thresholds</h4>
                <span className="text-xs text-[var(--text-muted)]">Minimum Buffer: 10 units</span>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {lowStockVariants.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[var(--text-muted)]">
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                    All stock levels optimal across warehouses.
                  </div>
                ) : (
                  lowStockVariants.map((item, idx) => (
                    <div key={idx} className="glass-card p-3 border border-amber-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <div>
                          <h5 className="font-bold text-xs">{item.productTitle}</h5>
                          <p className="text-[10px] text-[var(--text-muted)]">SKU: {item.sku} | Color: {item.color_name} | Size: {item.size}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-amber-400">{item.stock_quantity} units left</span>
                        <button className="btn-gold !py-1 !px-3 !text-[10px]">Restock +50</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="glass-card p-6 border border-[var(--border-subtle)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface-elevated)] p-4 rounded-2xl border border-[var(--border-subtle)]">
                <div>
                  <span className="text-xs text-[var(--text-muted)] font-semibold">AVAILABLE FOR WITHDRAWAL</span>
                  <div className="text-3xl font-extrabold font-['Outfit'] gold-text">${pendingPayout.toLocaleString()}</div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">Direct Bank Wire / Stripe Express Settlement</p>
                </div>

                <button
                  onClick={() => setPayoutRequested(true)}
                  disabled={payoutRequested}
                  className="btn-gold !py-3 !px-6 !text-xs shadow-xl"
                >
                  {payoutRequested ? (
                    <span className="flex items-center gap-1 text-black font-bold">
                      <CheckCircle className="w-4 h-4" /> Transfer Initiated ($12,450)
                    </span>
                  ) : (
                    'Request Merchant Payout'
                  )}
                </button>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--accent-gold)] mb-3">Recent Payout Settlements</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <div>
                      <div className="font-bold">Payout #SET-9082</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Aug 24, 2026 • Wire Transfer</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">+$15,800.00</div>
                      <div className="text-[10px] text-emerald-400">Settled</div>
                    </div>
                  </div>

                  <div className="flex justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <div>
                      <div className="font-bold">Payout #SET-8412</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Aug 10, 2026 • Wire Transfer</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">+$14,640.00</div>
                      <div className="text-[10px] text-emerald-400">Settled</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
