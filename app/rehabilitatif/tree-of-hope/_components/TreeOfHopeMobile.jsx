"use client";

import { useRef } from "react";
import { treeOfHopeContent as t } from "@/content/labels";
import useRevealOnView from "../hooks/useRevealOnView";
import { BackLink, Intro } from "./Intro";
import { EnvelopeIcon } from "./icons";
import { TREE_COLORS } from "./treeTheme";
import ComposeEnvelope from "./ComposeEnvelope";
import LikeButton from "./LikeButton";
import Pager from "./Pager";

const IMG_ASPECT = 2530 / 1280;

export default function TreeOfHopeMobile({
  revealed,
  onReveal,
  messages,
  page,
  totalPages,
  newId,
  pingId,
  onOpen,
  onLike,
  onCompose,
  onChangePage,
}) {
  const listRef = useRef(null);
  useRevealOnView(listRef, revealed, onReveal, 0.5, messages.length);

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-5 pt-22 lg:hidden">
      <div>
        <BackLink />
      </div>

      <header className="flex flex-col items-center text-center">
        <Intro titleClassName="text-3xl" />
      </header>

      {/* Gambar pohon dipotong ke bagian tengah supaya pohon terlihat besar */}
      <div className="relative mx-auto aspect-[5/4] w-full max-w-sm overflow-hidden">
        <div className="absolute left-1/2 top-0 h-full -translate-x-1/2" style={{ aspectRatio: IMG_ASPECT }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.image.src} alt={t.image.alt} className="absolute inset-0 h-full w-full object-contain" />
        </div>
      </div>

      <ComposeEnvelope
        onClick={onCompose}
        aspect={4 / 3}
        className="mx-auto aspect-[4/3] w-full max-w-xs"
        textClassName="text-[0.95rem]"
        ctaClassName="text-sm"
      />

      <p className="text-center text-sm text-muted-foreground">{t.moreMessages}</p>

      <ul ref={listRef} className="flex flex-col gap-3">
        {messages.map((m, i) => {
          const color = TREE_COLORS[i % TREE_COLORS.length];
          return (
            <li
              key={m.id}
              className={`relative rounded-3xl border border-border border-l-4 bg-card p-4 text-card-foreground shadow-sm ${color.accent} ${
                m.id === pingId ? "ring-2 ring-ring" : ""
              }`}
            >
              {m.id === newId && (
                <span className="absolute right-3 top-3 rounded-full bg-svarati-coral-dark px-2 py-0.5 text-xs font-semibold text-white">
                  {t.newLabel}
                </span>
              )}
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <EnvelopeIcon className={`block h-auto w-6 ${color.envelope}`} />
                {m.author}
              </p>
              <p className="mt-2 line-clamp-4 text-card-foreground">{m.text}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpen(i)}
                  aria-label={t.reader.readFull(m.author)}
                  className="rounded-full py-1 text-sm font-semibold text-svarati-lavender-dark hover:underline"
                >
                  {t.readMore}
                </button>
                <LikeButton liked={m.liked} count={m.supportCount} onClick={() => onLike(m.id)} />
              </div>
            </li>
          );
        })}
      </ul>

      <Pager page={page} totalPages={totalPages} onChange={onChangePage} />
    </section>
  );
}
