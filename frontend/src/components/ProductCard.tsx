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
  const images = product?.images || [];
  const primaryImg = (images.length > 0 ? (images.find(img => img?.is_primary)?.image_url || images[0]?.image_url) : null)
    || (product as any)?.primary_image
    || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop';

  const brandName = typeof product?.brand === 'string'
    ? product.brand
    : (product?.brand?.name || (product as any)?.brand_name || 'StyleHub');

  const price = Number(product?.base_price || (product as any)?.current_price || 0);
  const rating = Number(product?.avg_rating || (product as any)?.rating_avg || 4.5);
  const reviews = Number(product?.review_count || (product as any)?.rating_count || 0);
  const views = Number(product?.view_count || (product as any)?.views_count || 0);

  return (
    <div className="glass-card group relative flex flex-col h-full overflow-hidden border border-[var(--border-subtle)]">
      
      {/* Image Container with Zoom & Quick Actions Overlay */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-surface-elevated)] cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={primaryImg}
          alt={product?.title || 'Fashion Item'}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {Boolean(product?.discount_percentage) && (
            <span className="badge-gold font-extrabold text-[10px]">
              -{product.discount_percentage}% OFF
            </span>
          )}
          {Boolean(product?.is_featured) && (
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
              <span>{rating.toFixed(1)}</span>
              <span className="text-[var(--text-muted)]">({reviews})</span>
            </div>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-sm text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer line-clamp-1 mt-1"
          >
            {product?.title || 'Untitled Item'}
          </h3>
        </div>

        {/* Price & Views */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base text-[var(--text-primary)] font-['Outfit']">
              ${price.toFixed(2)}
            </span>
            {Boolean(product?.discount_percentage) && (
              <span className="text-xs text-[var(--text-muted)] line-through">
                ${(price * (1 + (product.discount_percentage || 0) / 100)).toFixed(2)}
              </span>
            )}
          </div>

          <span className="text-[10px] text-[var(--text-muted)]">
            {views} views
          </span>
        </div>
      </div>
    </div>
  );
};
