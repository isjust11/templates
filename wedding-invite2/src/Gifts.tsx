'use client';

import { useState } from 'react';

type GiftItem = {
  owner?: unknown;
  bank?: unknown;
  accountNumber?: unknown;
  qrImage?: unknown;
};

function unwrap(field: unknown): unknown {
  if (
    field &&
    typeof field === 'object' &&
    !Array.isArray(field) &&
    ('value' in field || 'type' in field || 'defaul' in field)
  ) {
    const obj = field as { value?: unknown; defaul?: unknown };
    return obj.value ?? obj.defaul;
  }
  return field;
}

function text(field: unknown): string {
  const value = unwrap(field);
  if (value == null || typeof value === 'object') return '';
  return String(value).trim();
}

function listGifts(raw: unknown): GiftItem[] {
  const value = unwrap(raw);
  if (Array.isArray(value)) return value as GiftItem[];
  if (typeof value === 'string' && value.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as GiftItem[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function formatAccount(value: string) {
  const digits = value.replace(/\s+/g, '');
  if (!/^\d+$/.test(digits) || digits.length < 8) return value.trim();
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value.replace(/\s+/g, ''));
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* keep number visible */
        }
      }}
      className="mt-4 inline-flex rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition hover:opacity-80"
      style={{ borderColor: 'color-mix(in srgb, var(--el-accent) 35%, transparent)', color: 'var(--el-accent)' }}
    >
      {copied ? done : label}
    </button>
  );
}

/** Wedding gift / bank transfer section driven by `data.gifts` ARRAY slot. */
export default function Gifts({
  gifts: raw,
  isVi = true,
}: {
  gifts: unknown;
  isVi?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const gifts = listGifts(raw)
    .map((g) => ({
      owner: text(g?.owner),
      bank: text(g?.bank),
      account: text(g?.accountNumber),
      qr: text(g?.qrImage),
    }))
    .filter((g) => g.account || g.qr);

  if (!gifts.length) return null;

  const copy = isVi ? 'Sao chép STK' : 'Copy account';
  const copied = isVi ? 'Đã sao chép' : 'Copied';
  const title = isVi ? 'Mừng cưới' : 'Wedding gifts';
  const intro = isVi
    ? 'Sự hiện diện của bạn là món quà quý giá nhất. Nếu muốn gửi lời chúc qua quà mừng, dùng thông tin dưới đây.'
    : 'Your presence is the greatest gift. Bank details are below if you wish to send a gift.';
  const show = isVi ? 'Xem thông tin mừng cưới' : 'Show gift details';
  const hide = isVi ? 'Ẩn thông tin' : 'Hide details';
  const scan = isVi ? 'Quét mã để chuyển khoản' : 'Scan to transfer';

  return (
    <section
      id="gifts"
      className="px-6 py-24"
      style={{ background: 'color-mix(in srgb, var(--el-bg-soft) 88%, var(--el-accent-soft))' }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em]" style={{ color: 'var(--el-accent)' }}>
          {isVi ? 'Hộp mừng cưới' : 'Gift box'}
        </p>
        <h2 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--el-ink)' }}>
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-lg font-serif text-base leading-relaxed" style={{ color: 'var(--el-muted)' }}>
          {intro}
        </p>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="mt-8 inline-flex rounded-full px-7 py-3 text-sm font-medium uppercase tracking-wider transition"
          style={{
            background: open ? 'transparent' : 'var(--el-accent)',
            color: open ? 'var(--el-accent)' : 'var(--el-on-accent)',
            border: open ? '1px solid color-mix(in srgb, var(--el-accent) 40%, transparent)' : '1px solid transparent',
          }}
        >
          {open ? hide : show}
        </button>

        {open ? (
          <div
            className={`mt-10 grid gap-5 ${gifts.length === 1 ? 'mx-auto max-w-md' : 'sm:grid-cols-2'}`}
          >
            {gifts.map((g, i) => {
              const displayAcc = formatAccount(g.account);
              return (
                <article
                  key={`${g.bank}-${g.account}-${i}`}
                  className="flex flex-col items-center rounded-[1.75rem] border px-6 py-8"
                  style={{
                    background: 'color-mix(in srgb, var(--el-bg) 92%, white)',
                    borderColor: 'color-mix(in srgb, var(--el-accent-soft) 55%, transparent)',
                  }}
                >
                  {g.qr ? (
                    <figure className="mb-5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.qr}
                        alt={`QR ${g.bank || g.owner}`}
                        className="mx-auto h-40 w-40 rounded-2xl object-contain"
                        loading="lazy"
                      />
                      <figcaption
                        className="mt-3 text-[11px] uppercase tracking-[0.2em]"
                        style={{ color: 'var(--el-muted)' }}
                      >
                        {scan}
                      </figcaption>
                    </figure>
                  ) : null}
                  {g.bank ? (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--el-accent)' }}>
                      {g.bank}
                    </p>
                  ) : null}
                  {displayAcc ? (
                    <p className="mt-3 font-display text-2xl tracking-[0.06em]" style={{ color: 'var(--el-ink)' }}>
                      {displayAcc}
                    </p>
                  ) : null}
                  {g.owner ? (
                    <p className="mt-2 text-sm" style={{ color: 'var(--el-muted)' }}>
                      {g.owner}
                    </p>
                  ) : null}
                  {g.account ? <CopyButton value={g.account} label={copy} done={copied} /> : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
