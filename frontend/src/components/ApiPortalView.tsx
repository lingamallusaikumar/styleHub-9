import React, { useState } from 'react';
import { Search, Terminal, ExternalLink, Zap, CheckCircle2, Lock, X, Play } from 'lucide-react';

interface ApiPortalViewProps {
  onBackToStore: () => void;
}

interface EndpointInfo {
  name: string;
  path: string;
  method: string;
  auth: boolean;
  desc: string;
}

const ENDPOINTS: EndpointInfo[] = [
  { name: "Products Catalog", path: "/api/catalog/products/", method: "GET", auth: false, desc: "Retrieve full product catalog, search queries, pagination & filter options." },
  { name: "Categories Hierarchy", path: "/api/catalog/categories/", method: "GET", auth: false, desc: "Explore fashion taxonomy tree, parent & child category hierarchies." },
  { name: "Luxury Brands", path: "/api/catalog/brands/", method: "GET", auth: false, desc: "List designer luxury fashion brands and seller profiles." },
  { name: "Shopping Cart", path: "/api/cart/", method: "GET / POST", auth: false, desc: "Manage cart items, quantities, and persistent session carts." },
  { name: "Customer Reviews", path: "/api/reviews/", method: "GET", auth: false, desc: "Customer ratings, reviews, verified purchases and feedback." },
  { name: "Personalized Recommendations", path: "/api/recommendations/", method: "GET", auth: false, desc: "AI-driven personalized product feeds and similar style matches." },
  { name: "JWT Authentication", path: "/api/auth/token/", method: "POST", auth: false, desc: "JWT Token obtain, refresh & secure authentication endpoints." },
  { name: "User Saved Wishlist", path: "/api/wishlist/", method: "GET / POST", auth: true, desc: "Manage customer saved items and personal wishlists." },
  { name: "Orders & Checkout", path: "/api/orders/", method: "GET / POST", auth: true, desc: "Order processing, shipment tracking, and customer order history." },
  { name: "Inventory Management", path: "/api/inventory/", method: "GET", auth: true, desc: "Warehouse stock levels, SKU tracking and inventory movements." },
  { name: "Seller Profiles & Stores", path: "/api/sellers/", method: "GET", auth: true, desc: "Vendor store management, seller profiles, and commissions." },
  { name: "Executive Analytics", path: "/api/analytics/", method: "GET", auth: true, desc: "Sales reporting, revenue metrics, conversion rates & insights." },
  { name: "System Audit Logs", path: "/api/audit/", method: "GET", auth: true, desc: "Security auditing, access logging, and system transaction trails." },
  { name: "Payments Gateway", path: "/api/payments/", method: "POST", auth: true, desc: "Mock payment authorization, charge capture, and refund processing." },
  { name: "Promotions & Coupons", path: "/api/promotions/", method: "POST", auth: false, desc: "Coupon validation (STYLE20, VIP50) and seasonal promo campaigns." }
];

export const ApiPortalView: React.FC<ApiPortalViewProps> = ({ onBackToStore }) => {
  const [search, setSearch] = useState('');
  const [activeModal, setActiveModal] = useState<EndpointInfo | null>(null);
  const [testStatus, setTestStatus] = useState<string>('');
  const [testPayload, setTestPayload] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const filteredEndpoints = ENDPOINTS.filter(ep =>
    ep.name.toLowerCase().includes(search.toLowerCase()) ||
    ep.path.toLowerCase().includes(search.toLowerCase()) ||
    ep.method.toLowerCase().includes(search.toLowerCase()) ||
    ep.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleTestEndpoint = async (ep: EndpointInfo) => {
    setActiveModal(ep);
    setLoading(true);
    setTestStatus('Sending GET request to ' + ep.path + '...');
    setTestPayload('Loading live API payload...');
    setLatency(null);

    const start = performance.now();
    try {
      const fullUrl = `http://127.0.0.1:8000${ep.path}`;
      const res = await fetch(fullUrl);
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setTestStatus(`HTTP ${res.status} ${res.statusText} (${elapsed} ms)`);

      try {
        const json = await res.json();
        setTestPayload(JSON.stringify(json, null, 2));
      } catch {
        const text = await res.text();
        setTestPayload(text);
      }
    } catch (err) {
      setTestStatus('Network Error / Server Connection Refused');
      setTestPayload(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 lg:px-8 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Bar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-gold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                15 Core API Services Online
              </span>
              <span className="text-xs text-[var(--text-muted)] font-semibold">Django REST Framework v3.15</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold font-['Outfit'] gold-text">
              StyleHub Interactive API Portal
            </h1>
            <p className="text-xs lg:text-sm text-[var(--text-muted)] mt-1">
              Explore, test, and inspect real-time REST API endpoints directly from the browser.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onBackToStore} className="btn-gold !py-2.5 !px-5 !text-xs">
              🛍️ Return to Storefront
            </button>
            <a
              href="http://127.0.0.1:8000/admin/"
              target="_blank"
              rel="noreferrer"
              className="btn-outline !py-2.5 !px-4 !text-xs flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Django Admin
            </a>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto mb-10">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search API endpoints by keyword, method, or path..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full pl-11 pr-4 py-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] shadow-xl transition-all"
          />
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-6">
          <h2 className="text-xl font-bold font-['Outfit'] flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[var(--accent-gold)]" />
            Backend REST API Directory
          </h2>
          <span className="text-xs font-semibold text-[var(--text-muted)]">
            Showing {filteredEndpoints.length} of {ENDPOINTS.length} endpoints
          </span>
        </div>

        {/* Endpoints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEndpoints.map((ep, idx) => (
            <div key={idx} className="glass-card p-5 flex flex-col justify-between space-y-4 border border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base text-[var(--text-primary)] font-['Outfit']">{ep.name}</h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    ep.auth ? 'bg-amber-500/20 text-amber-400' : ep.method.includes('GET') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {ep.method}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{ep.desc}</p>
              </div>

              <div>
                <div className="font-mono text-[11px] text-[var(--accent-gold)] bg-black/40 px-3 py-2 rounded-lg border border-[var(--border-subtle)] truncate">
                  {ep.path}
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-[var(--border-subtle)] text-[11px]">
                  <span className="flex items-center gap-1 text-[var(--text-muted)] font-medium">
                    {ep.auth ? (
                      <>
                        <Lock className="w-3 h-3 text-amber-400" />
                        Requires Auth
                      </>
                    ) : (
                      '🌐 Public Endpoint'
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestEndpoint(ep)}
                      className="btn-gold !py-1.5 !px-3 !text-[11px] flex items-center gap-1 shadow-md"
                    >
                      <Zap className="w-3 h-3 text-black" />
                      Test Payload
                    </button>
                    <a
                      href={`http://127.0.0.1:8000${ep.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
                      title="Open raw JSON"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Live Response Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-[var(--accent-gold)] max-h-[85vh] flex flex-col my-auto">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--accent-gold)] font-['Outfit']">
                    Testing: {activeModal.name}
                  </h3>
                  <p className="font-mono text-xs text-[var(--text-muted)]">{activeModal.path}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
                  testStatus.includes('200') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  testStatus.includes('401') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {testStatus}
                </div>

                {latency !== null && (
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    Response time: <strong className="text-[var(--accent-gold)]">{latency} ms</strong>
                  </span>
                )}
              </div>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-[#07080a] border border-[var(--border-subtle)] text-xs font-mono text-sky-400 overflow-x-auto max-h-[380px] leading-relaxed shadow-inner">
                  {loading ? 'Fetching live payload from http://127.0.0.1:8000...' : testPayload}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border-subtle)] bg-black/40 flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">CORS & Security Credentials Verified</span>
              <button
                onClick={() => setActiveModal(null)}
                className="btn-outline !py-1.5 !px-4 !text-xs"
              >
                Close Playground
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
