'use client';

import { useState } from 'react';
import { useJourney } from './context';
import { list, text, type GiftItem } from './fields';
import { GiftEnvelope } from './Botanicals';
import { Fade, SectionTitle, Sheet } from './ui';

function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ''));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button type="button" className="lj-copy" onClick={copy}>
      {copied ? done : label}
    </button>
  );
}

export default function Gift() {
  const { data, t } = useJourney();
  const gifts = list<GiftItem>(data.gifts).filter((g) => text(g.accountNumber));
  const [open, setOpen] = useState(false);
  if (!gifts.length) return null;

  return (
    <section className="lj-section lj-gift" id="lj-gift">
      <SectionTitle sub={t.giftBox}>{t.gift}</SectionTitle>
      <Fade>
        <button type="button" className="lj-gift__box" onClick={() => setOpen(true)} aria-label={t.giftBox}>
          <GiftEnvelope open={open} />
        </button>
        <p className="lj-gift__hint">{t.giftHint}</p>
      </Fade>

      <Sheet open={open} onClose={() => setOpen(false)} title={t.giftBox} closeLabel={t.close}>
        <p className="lj-sheet__lead">{t.giftIntro}</p>
        <div className="lj-gift__list">
          {gifts.map((g, i) => {
            const qr = text(g.qrImage);
            const account = text(g.accountNumber);
            return (
              <div className="lj-gift__card" key={i}>
                {qr ? <img className="lj-gift__qr" src={qr} alt="" loading="lazy" /> : null}
                <p className="lj-gift__bank">{text(g.bank)}</p>
                <p className="lj-gift__account">{account}</p>
                <p className="lj-gift__owner">{text(g.owner)}</p>
                <CopyButton value={account} label={t.copy} done={t.copied} />
              </div>
            );
          })}
        </div>
      </Sheet>
    </section>
  );
}
