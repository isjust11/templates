'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function RsvpForm({ eventSlug }: { eventSlug?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [formData, setFormData] = useState({ name: '', attending: 'yes', guests: 1 });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setLoading(true);
    setError('');
    try {
      if (!eventSlug) {
        throw new Error('Thiếu thông tin sự kiện. Mở thiệp qua /invite/[slug].');
      }
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: eventSlug,
          name: formData.name,
          attending: formData.attending === 'yes',
          guests: parseInt(formData.guests.toString(), 10) || 1,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || 'Gửi thất bại');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const glassCard = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, color-mix(in srgb, var(--el-bg-soft) 70%, white) 100%)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid color-mix(in srgb, var(--el-accent-soft) 55%, transparent)',
    boxShadow: '0 20px 60px color-mix(in srgb, var(--el-accent) 18%, transparent), inset 0 1px 0 rgba(255,255,255,0.9)',
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid color-mix(in srgb, var(--el-accent-soft) 55%, transparent)',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '100%',
    fontFamily: 'inherit',
    color: 'var(--el-ink)',
    outline: 'none',
    transition: 'all 0.2s',
  };

  if (submitted) {
    return (
      <section
        id="rsvp"
        className="py-28 px-4 relative"
        style={{ background: 'linear-gradient(180deg, var(--el-bg-soft) 0%, var(--el-bg) 100%)' }}
      >
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-10 text-center"
            style={glassCard}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 220 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{
                background: 'linear-gradient(135deg, var(--el-accent-soft), var(--el-accent))',
                boxShadow: '0 8px 32px color-mix(in srgb, var(--el-accent) 35%, transparent)',
              }}
            >
              <span className="text-white text-3xl">✓</span>
            </motion.div>
            <h3 className="font-display text-3xl text-petal-800 mb-3">Cảm ơn bạn!</h3>
            <p className="text-petal-600 font-serif leading-relaxed mb-6 italic">
              Phản hồi của bạn đã được ghi nhận. Hẹn gặp tại ngày vui!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-petal-500 hover:text-petal-700 font-sans text-sm font-medium transition-colors"
            >
              Gửi phản hồi khác
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="rsvp"
      className="py-28 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--el-bg) 0%, var(--el-bg-soft) 100%)' }}
    >
      {/* Blob decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--el-petal-200), transparent)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, var(--el-accent-soft), transparent)' }}
        />
      </div>

      <div className="max-w-lg mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-petal-400 mb-4 font-medium">Xác nhận</p>
          <h2 className="font-display text-5xl md:text-6xl text-petal-800 mb-4">
            Tham Dự
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--el-accent-soft))' }} />
            <span className="text-petal-300">♡</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--el-accent-soft))' }} />
          </div>
          <p className="text-petal-500 font-serif italic">
            Vui lòng xác nhận sự có mặt của bạn
          </p>
        </motion.div>

        {/* Glass form card */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-3xl p-8 md:p-10"
          style={glassCard}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot */}
            <input type="text" name="website" value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Name */}
            <div>
              <label className="block text-petal-700 font-sans text-sm font-medium mb-2">
                Họ và tên *
              </label>
              <input
                type="text" id="name" name="name" required
                value={formData.name} onChange={handleChange}
                placeholder="Nhập họ và tên"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.border = '1px solid color-mix(in srgb, var(--el-accent) 55%, transparent)';
                  e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--el-accent) 12%, transparent)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid color-mix(in srgb, var(--el-accent-soft) 55%, transparent)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Attending */}
            <div>
              <label className="block text-petal-700 font-sans text-sm font-medium mb-2">
                Sẽ tham dự chứ? *
              </label>
              <select
                id="attending" name="attending" required
                value={formData.attending} onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.border = '1px solid color-mix(in srgb, var(--el-accent) 55%, transparent)';
                  e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--el-accent) 12%, transparent)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid color-mix(in srgb, var(--el-accent-soft) 55%, transparent)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="yes">Có, tôi sẽ tham dự! 🎉</option>
                <option value="no">Rất tiếc, tôi không thể tham dự</option>
              </select>
            </div>

            {/* Guests */}
            {formData.attending === 'yes' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-petal-700 font-sans text-sm font-medium mb-2">
                  Số lượng khách *
                </label>
                <input
                  type="number" id="guests" name="guests" required min="1" max="10"
                  value={formData.guests} onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid color-mix(in srgb, var(--el-accent) 55%, transparent)';
                    e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--el-accent) 12%, transparent)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid color-mix(in srgb, var(--el-accent-soft) 55%, transparent)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </motion.div>
            )}

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm font-sans"
                style={{
                  color: 'var(--el-ink)',
                  background: 'color-mix(in srgb, var(--el-accent) 12%, white)',
                  border: '1px solid color-mix(in srgb, var(--el-accent) 30%, transparent)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl font-sans font-medium text-white uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
              style={{
                background: loading
                  ? 'rgba(200,200,200,0.5)'
                  : 'linear-gradient(135deg, var(--el-accent-soft), var(--el-accent))',
                boxShadow: loading
                  ? 'none'
                  : '0 8px 32px color-mix(in srgb, var(--el-accent) 35%, transparent)',
                color: 'var(--el-on-accent)',
              }}
            >
              {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
