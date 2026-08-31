import React from 'react';
import { Heart, Eye, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const primaryImg = product.images.find(img => img.is_primary)?.image_url || product.images[0]?.image_url;
  const brandName = typeof product.brand === 'string' ? product.brand : product.brand.name;

  return (
    <div className="glass-card group relative flex flex-col h-full overflow-hidden border border-[var(--border-subtle)]">
      
      {/* Image Container with Zoom & Quick Actions Overlay */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-surface-elevated)] cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={primaryImg}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discount_percentage && (
            <span className="badge-gold font-extrabold text-[10px]">
              -{product.discount_percentage}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className="badge-dark text-[10px] font-bold">
              FEATURED
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
            isWishlisted
              ? 'bg-red-500 text-white shadow-lg scale-110'
              : 'bg-black/40 text-white hover:bg-black/70 hover:scale-105'
          }`}
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 btn-outline !py-2 !text-xs !justify-center bg-black/70 backdrop-blur-md border-white/20 text-white hover:border-[var(--accent-gold)]"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="btn-gold !py-2 !px-3 !text-xs !justify-center shadow-xl"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
            <span>{brandName}</span>
            <div className="flex items-center gap-1 text-[var(--accent-gold)]">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.avg_rating}</span>
              <span className="text-[var(--text-muted)]">({product.review_count})</span>
            </div>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-sm text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer line-clamp-1 mt-1"
          >
            {product.title}
          </h3>
        </div>

        {/* Price & Views */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base text-[var(--text-primary)] font-['Outfit']">
              ${product.base_price.toFixed(2)}
            </span>
            {product.discount_percentage && (
              <span className="text-xs text-[var(--text-muted)] line-through">
                ${(product.base_price * (1 + product.discount_percentage / 100)).toFixed(2)}
              </span>
            )}
          </div>

          <span className="text-[10px] text-[var(--text-muted)]">
            {product.view_count} views
          </span>
        </div>
      </div>
    </div>
  );
};
