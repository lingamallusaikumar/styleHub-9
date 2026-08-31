import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { MOCK_REVIEWS, INITIAL_PRODUCTS } from '../data/mockData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, variant: ProductVariant, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const images = product?.images || [];
  const primaryImg = (images.length > 0 ? (images.find(img => img?.is_primary)?.image_url || images[0]?.image_url) : null)
    || (product as any)?.primary_image
    || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop';

  const [selectedImage, setSelectedImage] = useState(primaryImg);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product?.variants?.[0] || { id: 1, sku: 'DEFAULT', color_name: 'Standard', size: 'M', stock_quantity: 10 }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  const recommendedProducts = INITIAL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] max-h-[90vh] flex flex-col my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          
          {/* Left Column: Image Gallery */}
          <div className="p-6 flex flex-col justify-between bg-[var(--bg-surface-elevated)] border-r border-[var(--border-subtle)]">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-4 border border-[var(--border-subtle)]">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {product.discount_percentage && (
                <span className="absolute top-4 left-4 badge-gold text-xs font-bold">
                  SAVE {product.discount_percentage}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img.image_url ? 'border-[var(--accent-gold)] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 lg:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-2">
                <span>{typeof product.brand === 'string' ? product.brand : product.brand.name}</span>
                <span className="text-[var(--accent-gold)] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {product.avg_rating} ({product.review_count} reviews)
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] font-['Outfit'] mb-3">
                {product.title}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-extrabold gold-text font-['Outfit']">
                  ${product.base_price.toFixed(2)}
                </span>
                {product.discount_percentage && (
                  <span className="text-sm text-[var(--text-muted)] line-through">
                    ${(product.base_price * (1 + product.discount_percentage / 100)).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs lg:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color & Variant Selector */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-2">
                    SELECT COLOR: <span className="text-[var(--text-primary)]">{selectedVariant.color_name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(product.variants.map(v => v.color_name))).map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          const v = product.variants.find(item => item.color_name === color) || product.variants[0];
                          setSelectedVariant(v);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          selectedVariant.color_name === color
                            ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]'
                            : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-white/40'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] flex items-center justify-between mb-2">
                    <span>SELECT SIZE</span>
                    <span className="text-[10px] text-[var(--accent-gold)] font-semibold cursor-pointer">Size Guide</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold border flex items-center justify-center transition-all ${
                          selectedVariant.id === v.id
                            ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-gradient)] text-black font-extrabold shadow-md'
                            : 'border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-white/40'
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Indicator */}
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className={`w-2 h-2 rounded-full ${selectedVariant.stock_quantity > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className={selectedVariant.stock_quantity > 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {selectedVariant.stock_quantity > 0 ? `In Stock (${selectedVariant.stock_quantity} remaining)` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-full px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-lg font-bold px-2 text-[var(--text-muted)] hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-lg font-bold px-2 text-[var(--text-muted)] hover:text-white"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={() => {
                    onAddToCart(product, selectedVariant, quantity);
                    onClose();
                  }}
                  className="flex-1 btn-gold !py-3 !justify-center !text-sm shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4 text-black" />
                  Add {quantity} to Bag • ${(product.base_price * quantity).toFixed(2)}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-full border border-[var(--border-subtle)] transition-all ${
                    isWishlisted ? 'bg-red-500 text-white' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)]'
                  }`}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-around pt-2 text-[11px] text-[var(--text-muted)] font-semibold">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-[var(--accent-gold)]" /> Free Express Delivery</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-gold)]" /> Authenticity Verified</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom AI Recommendations Section */}
        <div className="p-6 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" />
              Complete The Look (AI Recommendations)
            </h4>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {recommendedProducts.map(rec => (
              <div key={rec.id} className="glass-card p-3 flex items-center gap-3">
                <img src={rec.images[0]?.image_url} alt="" className="w-12 h-14 object-cover rounded-lg" />
                <div>
                  <h5 className="font-bold text-xs line-clamp-1">{rec.title}</h5>
                  <span className="text-xs text-[var(--accent-gold)] font-bold">${rec.base_price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
