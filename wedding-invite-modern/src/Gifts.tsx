'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useModern } from './context';
import { imageUrl, list, text, type GiftItem } from './fields';
import Reveal, { LineReveal } from './Reveal';
import Garden from './Garden';

function formatAccount(value: string) {
  const digits = value.replace(/\s+/g, '');
  if (!/^\d+$/.test(digits) || digits.length < 8) return value.trim();
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

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
          // Clipboard may be blocked; number remains visible.
        }
      }}
    >
      {copied ? t.copied : t.copy}
    </button>
  );
}

type ResolvedGift = {
  bank: string;
  owner: string;
  account: string;
  qr: string;
};

export default function Gifts() {
  const { data, t } = useModern();
  const [open, setOpen] = useState(false);

  const gifts: ResolvedGift[] = list<GiftItem>(data.gifts)
    .map((g) => ({
      bank: text(g?.bank),
      owner: text(g?.owner),
      account: text(g?.accountNumber),
      qr: imageUrl(g?.qrImage),
    }))
    .filter((g) => g.account || g.qr);

  if (!gifts.length) return null;

  return (
    <section className="elm-section" id="gifts" style={{ background: 'var(--el-bg-soft)' }}>
      <Garden preset="gifts" />
      <div className="elm-narrow" style={{ textAlign: 'center' }}>
        <div className="elm-head elm-head--center">
          <span className="elm-eyebrow">{t.giftBox}</span>
          <h2 className="elm-display elm-h2">
            <LineReveal>{t.gifts}</LineReveal>
          </h2>
        </div>

        <Reveal>
          <p className="elm-muted elm-gifts__intro">{t.giftsIntro}</p>
          <button
            type="button"
            className="elm-btn elm-btn--ghost"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t.hideGifts : t.showGifts}
          </button>
        </Reveal>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className={`elm-gifts${gifts.length === 1 ? ' elm-gifts--single' : ''}`}>
                {gifts.map((g, i) => {
                  const displayAcc = formatAccount(g.account);
                  return (
                    <Reveal key={`${g.bank}-${g.account}-${i}`} className="elm-gift" delay={i * 0.08}>
                      {g.qr ? (
                        <figure className="elm-gift__qr-wrap">
                          <img className="elm-gift__qr" src={g.qr} alt={`QR ${g.bank || g.owner}`} loading="lazy" />
                          <figcaption className="elm-gift__qr-caption">{t.scanQr}</figcaption>
                        </figure>
                      ) : null}

                      <div className="elm-gift__body">
                        {g.bank ? <span className="elm-eyebrow elm-gift__bank">{g.bank}</span> : null}
                        {displayAcc ? (
                          <p className="elm-gift__acc" aria-label={g.account}>
                            {displayAcc}
                          </p>
                        ) : null}
                        {g.owner ? <p className="elm-gift__owner">{g.owner}</p> : null}
                        {g.account ? (
                          <div className="elm-gift__actions">
                            <CopyButton value={g.account} />
                          </div>
                        ) : null}
                      </div>
                    </Reveal>
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
