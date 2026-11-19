"use client";

import { useRef } from "react";
import { Mail } from "lucide-react";
import { treeOfHopeContent as t } from "@/content/labels";
import { Card, CardFooter } from "@/components/Card";
import useRevealOnView from "../hooks/useRevealOnView";
import { BackLink, Intro } from "./Intro";
import ComposeEnvelope from "./ComposeEnvelope";
import LikeButton from "./LikeButton";
import Pager from "./Pager";
import ManageButtons from "./ManageButtons";

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
  onEdit,
  onDelete,
}) {
  const listRef = useRef(null);
  useRevealOnView(listRef, revealed, onReveal, 0.5, messages.length);

  return (
    <section
      className="mx-auto flex max-w-xl flex-col gap-5 lg:hidden"
      style={{ paddingTop: "var(--toh-top)" }}
    >
      <div>
        <BackLink />
      </div>

      <header className="flex flex-col items-center text-center">
        <Intro titleClassName="text-balance text-3xl" />
      </header>

      <div className="relative mx-auto aspect-[5/4] w-full max-w-sm overflow-hidden">
        <div
          className="absolute left-1/2 top-0 h-full -translate-x-1/2"
          style={{ aspectRatio: IMG_ASPECT }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t.image.src}
            alt={t.image.alt}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </div>

      <ComposeEnvelope
        onClick={onCompose}
        className="mx-auto aspect-[4/3] w-full max-w-xs text-base"
      />

      <p className="text-center text-sm text-svarati-lavender-dark">
        {t.moreMessages}
      </p>

      <ul ref={listRef} className="flex flex-col gap-3">
        {messages.map((m, i) => (
          <li key={m.id}>
            <Card
              variant="white"
              size="sm"
              topBorder="coral"
              className={`relative shadow-lg ${m.id === pingId ? "ring-2 ring-ring" : ""}`}
            >
              {/* Tombol transparan (sama seperti desktop): seluruh kartu bisa diklik untuk
                  membaca pesan lengkap. Tidak ikut urutan Tab karena tombol "Baca pesan"
                  di footer sudah menjadi pintu masuk untuk keyboard dan pembaca layar. */}
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => onOpen(i)}
                className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-svarati-coral-dark/30 active:bg-svarati-coral-dark/5"
              />

              {m.id === newId && (
                <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-svarati-coral-dark px-2 py-0.5 text-xs font-semibold text-white">
                  {t.newLabel}
                </span>
              )}
              <p className="flex items-center gap-2 text-sm font-semibold text-svarati-lavender-dark">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-svarati-coral-dark/60 bg-white shadow-sm">
                  <Mail
                    className="size-4 text-svarati-coral-dark"
                    aria-hidden="true"
                  />
                </span>
                {m.author}
              </p>
              <p className="mt-2 line-clamp-4 italic leading-relaxed text-svarati-coral-dark">
                “{m.text}”
              </p>

              {/* z-20: berada di atas tombol penutup kartu, jadi klik Ubah/Hapus berdiri sendiri */}
              <ManageButtons
                until={m.editableUntil}
                className="relative z-20 mt-3"
                onEdit={() => onEdit(m)}
                onDelete={() => onDelete(m)}
              />

              <CardFooter>
                <button
                  type="button"
                  onClick={() => onOpen(i)}
                  aria-label={t.reader.readFull(m.author)}
                  className="relative z-20 rounded-full py-1 text-sm font-semibold text-svarati-lavender-dark hover:underline"
                >
                  {t.readMore}
                </button>
                {/* LikeButton sudah relative z-20 di dalamnya */}
                <LikeButton
                  liked={m.liked}
                  count={m.supportCount}
                  onClick={() => onLike(m.id)}
                />
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>

      <Pager page={page} totalPages={totalPages} onChange={onChangePage} />
    </section>
  );
}