import React, { useState } from 'react';
import { Crown, Sparkles, Gift, Check, Award, ChevronRight, Zap } from 'lucide-react';
import { User } from '../types';

interface VipLoyaltyProgramProps {
  user: User | null;
  onRedeemReward: (couponCode: string) => void;
}

export const VipLoyaltyProgram: React.FC<VipLoyaltyProgramProps> = ({ user, onRedeemReward }) => {
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  const points = 2450;
  const currentTier = 'GOLD VIP';
  const nextTier = 'PLATINUM VIP';
  const pointsToNext = 550;
  const progressPercent = Math.min(100, Math.round((points / 3000) * 100));

  const rewards = [
    { code: 'VIP50', title: '$50 Flat Discount', cost: 1000, desc: 'Applies to any purchase over $300' },
    { code: 'STYLE20', title: '20% Off Autumn Collection', cost: 1500, desc: 'Unlimited use during current season' },
    { code: 'FREESHIP', title: 'Free Express Shipping', cost: 500, desc: 'Complimentary courier delivery on next order' }
  ];

  const handleRedeem = (reward: typeof rewards[0]) => {
    setRedeemedCode(reward.code);
    onRedeemReward(reward.code);
  };

  return (
    <section className="glass-panel p-6 lg:p-8 rounded-3xl border border-[var(--border-subtle)] my-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-[var(--border-subtle)] pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-gold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              CLIENT PRIVILEGES
            </span>
            <span className="text-xs text-[var(--text-muted)] font-semibold">Tier Progress & Rewards</span>
          </div>
          <h3 className="text-2xl font-extrabold font-['Outfit'] gold-text">
            StyleHub Atelier VIP Loyalty
          </h3>
        </div>

        <div className="flex items-center gap-4 bg-[var(--bg-surface-elevated)] p-4 rounded-2xl border border-[var(--border-subtle)]">
          <Award className="w-8 h-8 text-[var(--accent-gold)]" />
          <div>
            <div className="text-xs text-[var(--text-muted)] font-semibold">CURRENT BALANCE</div>
            <div className="text-xl font-extrabold font-['Outfit']">{points.toLocaleString()} Points</div>
          </div>
        </div>
      </div>

      {/* Tier Progress Bar */}
      <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[var(--accent-gold)] font-['Outfit'] text-sm flex items-center gap-1">
            <Crown className="w-4 h-4" /> {currentTier}
          </span>
          <span className="text-[var(--text-muted)]">
            Next Tier: <strong className="text-white">{nextTier}</strong> ({pointsToNext} pts away)
          </span>
        </div>

        <div className="w-full bg-[var(--bg-primary)] h-3 rounded-full overflow-hidden border border-[var(--border-subtle)] p-0.5">
          <div
            className="h-full rounded-full bg-[var(--accent-gold-gradient)] transition-all duration-1000 shadow-md"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-[var(--text-muted)] pt-1 font-semibold">
          <span>Bronze (0 pts)</span>
          <span>Silver (1,000 pts)</span>
          <span className="text-[var(--accent-gold)] font-bold">Gold (2,000 pts)</span>
          <span>Platinum (3,000 pts)</span>
        </div>
      </div>

      {/* Rewards Redeem Cards */}
      <div className="space-y-4">
        <h4 className="font-bold text-sm font-['Outfit'] flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-[var(--accent-gold)]" />
          Exclusive Tier Privilege Vouchers
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewards.map((r, idx) => (
            <div key={idx} className="glass-card p-4 border border-[var(--border-subtle)] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-bold text-sm">{r.title}</h5>
                  <span className="text-[10px] font-extrabold text-[var(--accent-gold)] bg-[var(--accent-gold-glow)] px-2 py-0.5 rounded-full">
                    {r.cost} PTS
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{r.desc}</p>
              </div>

              <button
                onClick={() => handleRedeem(r)}
                disabled={redeemedCode === r.code}
                className={`w-full !py-2 !text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1 ${
                  redeemedCode === r.code
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'btn-gold shadow-md hover:scale-102'
                }`}
              >
                {redeemedCode === r.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Voucher Claimed ({r.code})
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-black" /> Redeem Voucher ({r.code})
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
