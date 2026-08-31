import React, { useState } from 'react';
import { Sparkles, Eye, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { Product } from '../types';

interface SmartRecommendationEngineProps {
  currentProduct?: Product | null;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlist: Product[];
}

export const SmartRecommendationEngine: React.FC<SmartRecommendationEngineProps> = ({
  currentProduct,
  allProducts,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlist,
}) => {
  const [activeTab, setActiveTab] = useState<'look' | 'similar' | 'trending'>('look');

  // Filter recommendations
  const getLookItems = () => {
    if (!currentProduct) return allProducts.slice(0, 4);
    return allProducts.filter(p => p.id !== currentProduct.id && (p.category !== currentProduct.category || p.brand !== currentProduct.brand)).slice(0, 4);
  };

  const getSimilarItems = () => {
    if (!currentProduct) return allProducts.slice(1, 5);
    return allProducts.filter(p => p.id !== currentProduct.id && (p.category === currentProduct.category || p.gender === currentProduct.gender)).slice(0, 4);
  };

  const getTrendingItems = () => {
    return allProducts.filter(p => p.is_trending || p.avg_rating >= 4.8).slice(0, 4);
  };

  const items = activeTab === 'look' ? getLookItems() : activeTab === 'similar' ? getSimilarItems() : getTrendingItems();

  return (
    <section className="glass-panel p-6 lg:p-8 rounded-3xl border border-[var(--border-subtle)] my-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-gold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              AI STYLE ENGINE
            </span>
            <span className="text-xs text-[var(--text-muted)] font-semibold">Bespoke Vector Matching</span>
          </div>
          <h3 className="text-2xl font-extrabold font-['Outfit']">
            {currentProduct ? `Complete The Look: ${currentProduct.title}` : 'Curated Style Recommendations'}
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-full border border-[var(--border-subtle)]">
          <button
            onClick={() => setActiveTab('look')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'look' ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            Complete Look
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'similar' ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            Similar Styles
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'trending' ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            Trending Now
          </button>
        </div>
      </div>

      {/* Recommended Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(product => {
          const images = product?.images || [];
          const primaryImg = (images.length > 0 ? (images.find(img => img?.is_primary)?.image_url || images[0]?.image_url) : null)
            || (product as any)?.primary_image
            || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop';
          const brandName = typeof product?.brand === 'string' ? product.brand : (product?.brand?.name || 'StyleHub');
          const isWishlisted = wishlist.some(w => w.id === product.id);

          return (
            <div key={product.id} className="glass-card group relative flex flex-col justify-between p-3 border border-[var(--border-subtle)]">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-[var(--bg-surface-elevated)] cursor-pointer" onClick={() => onSelectProduct(product)}>
                <img
                  src={primaryImg}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all ${
                    isWishlisted ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/70'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              <div className="space-y-1 px-1">
                <span className="text-[10px] font-bold text-[var(--accent-gold)] uppercase tracking-wider">{brandName}</span>
                <h4 
                  onClick={() => onSelectProduct(product)}
                  className="font-bold text-xs text-[var(--text-primary)] truncate cursor-pointer hover:text-[var(--accent-gold)] transition-colors"
                >
                  {product.title}
                </h4>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <span className="font-extrabold text-xs font-['Outfit']">${Number(product.base_price).toFixed(2)}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="p-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--glass-bg)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white"
                      title="Quick View"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="p-1.5 rounded-full bg-[var(--accent-gold-gradient)] text-black font-bold hover:scale-105 transition-transform"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
