import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Lock, CheckCircle2, ArrowLeft, ArrowRight, Truck } from 'lucide-react';
import { CartItem, ShippingAddress, Order } from '../types';
import { ApiService } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: string;
  discountAmount: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  discountAmount,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipient_name: 'Eleanor Vance',
    street_address: '742 Fifth Avenue',
    city: 'New York',
    state: 'NY',
    postal_code: '10019',
    country: 'United States'
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '888',
    cardHolder: 'ELEANOR VANCE'
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
  const shippingFee = subtotal >= 200 ? 0 : 15;
  const taxAmount = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const totalAmount = Math.round((subtotal - discountAmount + shippingFee + taxAmount) * 100) / 100;

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    try {
      const order = await ApiService.checkoutOrder({
        shipping_address: shippingAddress,
        coupon_code: appliedCoupon,
        subtotal,
        discount_amount: discountAmount,
        items: cartItems.map(item => ({
          product_title: item.product.title,
          color_name: item.variant.color_name,
          size: item.variant.size,
          sku: item.variant.sku,
          image_url: item.product.image_url,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.total_price
        }))
      });
      setTimeout(() => {
        setIsProcessing(false);
        onOrderSuccess(order);
        onClose();
      }, 1500);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] my-auto p-6 lg:p-8 space-y-6">
        
        {/* Header & Steps Indicator */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div>
            <span className="text-xs text-[var(--accent-gold)] font-bold uppercase tracking-wider">SECURE CHECKOUT</span>
            <h3 className="text-2xl font-extrabold font-['Outfit']">Complete Your Purchase</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-surface-elevated)]">
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-around text-xs font-bold border-b border-[var(--border-subtle)] pb-4">
          <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[var(--accent-gold)]' : 'text-[var(--text-muted)]'}`}>
            <span className="w-6 h-6 rounded-full bg-[var(--accent-gold-glow)] flex items-center justify-center text-xs">1</span>
            Shipping
          </span>
          <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[var(--accent-gold)]' : 'text-[var(--text-muted)]'}`}>
            <span className="w-6 h-6 rounded-full bg-[var(--accent-gold-glow)] flex items-center justify-center text-xs">2</span>
            Payment
          </span>
          <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-[var(--accent-gold)]' : 'text-[var(--text-muted)]'}`}>
            <span className="w-6 h-6 rounded-full bg-[var(--accent-gold-glow)] flex items-center justify-center text-xs">3</span>
            Confirmation
          </span>
        </div>

        {/* STEP 1: Shipping Address */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="font-bold text-sm text-[var(--text-primary)]">1. Shipping Address</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--text-muted)] block font-semibold mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={shippingAddress.recipient_name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, recipient_name: e.target.value })}
                  className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--text-muted)] block font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress.street_address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street_address: e.target.value })}
                  className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--text-muted)] block font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--text-muted)] block font-semibold mb-1">State / Zip Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-1/2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                  <input
                    type="text"
                    value={shippingAddress.postal_code}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                    className="w-1/2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setStep(2)} className="btn-gold">
                Continue to Payment
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Details */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="font-bold text-sm text-[var(--text-primary)]">2. Encrypted Payment Details</h4>
            
            <div className="glass-card p-4 space-y-3 bg-[var(--bg-surface-elevated)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[var(--accent-gold)]" />
                  Credit / Debit Card
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
                </span>
              </div>

              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs font-mono tracking-widest text-[var(--text-primary)]"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expDate}
                  onChange={(e) => setPaymentData({ ...paymentData, expDate: e.target.value })}
                  className="w-1/2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                  className="w-1/2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs font-mono"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-xl bg-black/40 border border-[var(--border-subtle)] space-y-1 text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Shipping & Tax</span>
                <span>${(shippingFee + taxAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]">
                <span>Total Amount Due</span>
                <span className="gold-text text-base font-['Outfit']">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setStep(1)} className="btn-outline !py-2 !px-4 !text-xs">
                <ArrowLeft className="w-4 h-4" /> Back to Shipping
              </button>

              <button
                onClick={handleSubmitOrder}
                disabled={isProcessing}
                className="btn-gold !py-3 !px-6 shadow-2xl"
              >
                {isProcessing ? 'Processing Order...' : `Pay $${totalAmount.toFixed(2)} Now`}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
