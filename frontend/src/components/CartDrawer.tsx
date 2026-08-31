import React, { useState } from 'react';
import { X, Trash2, Tag, ShoppingBag, ArrowRight, Check, Sparkles, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { ApiService } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onProceedToCheckout: (appliedCoupon: string, discountAmount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ valid: boolean; text: string } | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
  const freeShippingThreshold = 200;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = ApiService.validateCoupon(couponInput, subtotal);
    setCouponMessage({ valid: res.valid, text: res.message });
    if (res.valid) {
      setAppliedDiscount(res.discount);
      setAppliedCouponCode(couponInput.trim().toUpperCase());
    } else {
      setAppliedDiscount(0);
      setAppliedCouponCode('');
    }
  };

  const finalSubtotal = Math.max(0, subtotal - appliedDiscount);
  const estimatedShipping = subtotal >= freeShippingThreshold ? 0.00 : 15.00;
  const estimatedTax = Math.round((finalSubtotal * 0.08) * 100) / 100;
  const estimatedTotal = Math.round((finalSubtotal + estimatedShipping + estimatedTax) * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-[var(--border-subtle)] flex flex-col justify-between shadow-2xl animate-slide-in-right">
          
          {/* Header */}
          <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[var(--accent-gold)]" />
              <h3 className="font-extrabold text-lg font-['Outfit']">Your Shopping Bag</h3>
              <span className="badge-gold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[var(--bg-surface-elevated)] p-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1 text-xs">
                <Truck className="w-4 h-4 text-[var(--accent-gold)]" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-400">UNLOCKED: Free Express Shipping!</span>
                ) : (
                  <span>Add <strong className="text-[var(--accent-gold)]">${remainingForFreeShipping.toFixed(2)}</strong> for Free Express Shipping</span>
                )}
              </span>
              <span className="text-[var(--text-muted)]">{Math.round(progressPercent)}%</span>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-gold-gradient)] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[var(--text-muted)]">
                <ShoppingBag className="w-16 h-16 opacity-30 text-[var(--accent-gold)]" />
                <h4 className="font-bold text-base text-[var(--text-primary)]">Your bag is empty</h4>
                <p className="text-xs max-w-xs">Explore our latest cashmere coats, Italian leather, and bespoke tailoring collections.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="glass-card p-3 flex gap-3 items-center">
                  <img
                    src={item.product.image_url}
                    alt={item.product.title}
                    className="w-16 h-20 object-cover rounded-xl border border-[var(--border-subtle)]"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">
                      {item.product.brand_name}
                    </span>
                    <h4 className="font-bold text-xs text-[var(--text-primary)] truncate">
                      {item.product.title}
                    </h4>
                    <span className="text-[11px] text-[var(--text-secondary)] block">
                      {item.variant.color_name} • Size {item.variant.size}
                    </span>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-xs text-[var(--accent-gold)] font-['Outfit']">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Toggles */}
                      <div className="flex items-center bg-[var(--bg-surface-elevated)] rounded-full border border-[var(--border-subtle)] px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="text-xs font-bold px-1.5 text-[var(--text-muted)] hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="text-xs font-bold px-1.5 text-[var(--text-muted)] hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-4">
              
              {/* Coupon Code Section */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="Try code: STYLE20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="btn-outline !py-1.5 !px-4 !text-xs"
                  >
                    Apply
                  </button>
                </div>

                {couponMessage && (
                  <p className={`text-[11px] font-semibold ${couponMessage.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-[var(--text-primary)]">${subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount ({appliedCouponCode})</span>
                    <span>-${appliedDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{estimatedShipping === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${estimatedShipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]">
                  <span>Order Total</span>
                  <span className="gold-text text-base font-['Outfit']">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onProceedToCheckout(appliedCouponCode, appliedDiscount);
                  onClose();
                }}
                className="w-full btn-gold !py-3.5 !justify-center !text-sm shadow-2xl"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
