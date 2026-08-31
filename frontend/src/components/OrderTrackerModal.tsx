import React from 'react';
import { X, Truck, CheckCircle2, Clock, MapPin, PackageCheck, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onRequestReturn: (orderNumber: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onRequestReturn,
}) => {
  if (!order) return null;

  const STATUS_STEPS = [
    { key: 'PENDING', label: 'Order Placed', desc: 'Order initialized and confirmed' },
    { key: 'PAID', label: 'Payment Verified', desc: 'Payment authorized successfully' },
    { key: 'PROCESSING', label: 'Fulfillment', desc: 'Items packed in luxury box' },
    { key: 'SHIPPED', label: 'In Transit', desc: order.shipment?.current_location || 'Handed to carrier' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Hand-delivered to your doorstep' },
  ];

  const currentIdx = STATUS_STEPS.findIndex(s => s.key === order.status);
  const activeIdx = currentIdx !== -1 ? currentIdx : 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] my-auto p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-gold">LIVE TRACKING</span>
              <span className="text-xs text-[var(--text-muted)]">Order #{order.order_number}</span>
            </div>
            <h3 className="text-2xl font-extrabold font-['Outfit'] mt-1">Shipment Lifecycle</h3>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-surface-elevated)]">
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Carrier Info Card */}
        {order.shipment && (
          <div className="glass-card p-4 flex items-center justify-between bg-[var(--bg-surface-elevated)]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-xs">{order.shipment.carrier}</h4>
                <p className="text-xs text-[var(--accent-gold)] font-mono font-bold">{order.shipment.tracking_number}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[var(--text-muted)] block font-semibold">ESTIMATED DELIVERY</span>
              <span className="font-extrabold text-sm text-emerald-400 font-['Outfit']">{order.shipment.estimated_delivery}</span>
            </div>
          </div>
        )}

        {/* Vertical Visual Timeline */}
        <div className="py-2 space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border-subtle)]">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= activeIdx;
            const isCurrent = idx === activeIdx;

            return (
              <div key={step.key} className="flex items-start gap-4 relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-[var(--accent-gold-gradient)] text-black shadow-lg scale-105'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="flex-1">
                  <h5 className={`font-bold text-sm ${isCurrent ? 'text-[var(--accent-gold)]' : isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                    {step.label}
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Items Summary */}
        <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2">
          <h5 className="font-bold text-xs text-[var(--text-muted)] uppercase tracking-wider">Order Contents</h5>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <img src={item.image_url} alt="" className="w-8 h-10 object-cover rounded-md" />
                <span>{item.product_title} ({item.color_name}, {item.size}) x{item.quantity}</span>
              </div>
              <span className="font-bold">${item.total_price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
          <button
            onClick={() => onRequestReturn(order.order_number)}
            className="text-xs text-[var(--text-muted)] hover:text-red-400 font-semibold transition-colors flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Request Return / Exchange
          </button>

          <button onClick={onClose} className="btn-outline !py-2 !px-4 !text-xs">
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
