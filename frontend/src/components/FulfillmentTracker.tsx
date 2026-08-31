import React from 'react';
import { Truck, CheckCircle2, Clock, MapPin, Package, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface FulfillmentTrackerProps {
  order: Order;
  onClose: () => void;
}

export const FulfillmentTracker: React.FC<FulfillmentTrackerProps> = ({ order, onClose }) => {
  const steps = [
    { label: 'Order Placed', time: order.created_at, done: true, current: false },
    { label: 'QC Quality Inspected', time: 'Aug 31, 2026 - 14:20', done: true, current: false },
    { label: 'Fulfillment Hub Dispatched', time: 'Sep 01, 2026 - 08:15', done: true, current: true },
    { label: 'In Transit via Courier', time: 'Estimated Sep 02, 2026', done: false, current: false },
    { label: 'Delivered to Doorstep', time: 'Estimated Sep 03, 2026', done: false, current: false }
  ];

  return (
    <div className="bg-[var(--bg-surface-elevated)] p-6 rounded-3xl border border-[var(--border-subtle)] space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-gold">EXPRESS LOGISTICS</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Insured Courier
            </span>
          </div>
          <h4 className="font-extrabold text-lg font-['Outfit'] gold-text">
            Logistics Pipeline: #{order.order_number}
          </h4>
        </div>

        <div className="text-right">
          <div className="text-xs text-[var(--text-muted)] font-semibold">TRACKING NUMBER</div>
          <div className="font-mono text-xs text-[var(--accent-gold)] font-bold">{order.tracking_number || 'SH-908123-US'}</div>
        </div>
      </div>

      {/* Step by Step Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-subtle)]">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-start gap-4">
            <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step.done ? 'bg-[var(--accent-gold-gradient)] text-black shadow-md' : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}>
              {step.done ? <CheckCircle2 className="w-3.5 h-3.5 text-black" /> : idx + 1}
            </div>

            <div>
              <h5 className={`font-bold text-xs ${step.current ? 'text-[var(--accent-gold)] font-extrabold' : 'text-white'}`}>
                {step.label} {step.current && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full ml-2">IN PROGRESS</span>}
              </h5>
              <span className="text-[10px] text-[var(--text-muted)] font-semibold">{step.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
