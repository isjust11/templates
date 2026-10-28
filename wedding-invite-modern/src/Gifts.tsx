'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useModern } from './context';
import { imageUrl, list, text, type GiftItem } from './fields';
import Reveal, { LineReveal } from './Reveal';

function CopyButton({ value }: { value: string }) {
  const { t } = useModern();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="elm-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value.replace(/\s+/g, ''));
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard blocked (insecure context / in-app browser) — the number is still visible.
        }
      }}
    >
      {copied ? t.copied : t.copy}
    </button>
  );
}

export default function Gifts() {
  const { data, t } = useModern();
  const [open, setOpen] = useState(false);
  const gifts = list<GiftItem>(data.gifts).filter((g) => text(g?.accountNumber));
  if (!gifts.length) return null;

  return (
    <section className="elm-section" id="gifts" style={{ background: 'var(--el-bg-soft)' }}>
      <div className="elm-narrow" style={{ textAlign: 'center' }}>
        <div className="elm-head elm-head--center">
          <span className="elm-eyebrow">{t.giftBox}</span>
          <h2 className="elm-display elm-h2">
            <LineReveal>{t.gifts}</LineReveal>
          </h2>
        </div>
        <Reveal>
          <p className="elm-muted" style={{ margin: '0 auto 32px', maxWidth: 520 }}>
            {t.giftsIntro}
          </p>
          <button type="button" className="elm-btn elm-btn--ghost" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? t.hideGifts : t.showGifts}
          </button>
        </Reveal>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="elm-gifts">
                {gifts.map((g, i) => {
                  const qr = imageUrl(g.qrImage);
                  const account = text(g.accountNumber);
                  return (
                    <div key={i} className="elm-gift" style={qr ? undefined : { gridTemplateColumns: '1fr' }}>
                      {qr ? <img className="elm-gift__qr" src={qr} alt={`QR ${text(g.bank)}`} loading="lazy" /> : null}
                      <div style={{ display: 'grid', gap: 4 }}>
                        <span className="elm-eyebrow">{text(g.bank)}</span>
                        <span className="elm-gift__acc">{account}</span>
                        <span>{text(g.owner)}</span>
                        <div style={{ marginTop: 6 }}>
                          <CopyButton value={account} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
