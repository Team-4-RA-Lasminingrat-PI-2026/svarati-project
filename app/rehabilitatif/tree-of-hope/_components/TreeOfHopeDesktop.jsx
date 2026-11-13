"use client";

import { useRef, useState } from "react";
import { ChevronDown, MousePointerClick } from "lucide-react";
import { treeOfHopeContent as t } from "@/content/labels";
import useScrollProgress from "../hooks/useScrollProgress";
import { BackLink, INTRO_BADGE } from "./Intro";
import { EnvelopeIcon } from "./icons";
import { paletteOf } from "./treeTheme";
import ComposeEnvelope from "./ComposeEnvelope";
import LikeButton from "./LikeButton";
import Pager from "./Pager";

// Panggung berrasio tetap 1.8. Semua koordinat = persen panggung.
const STAGE_ASPECT = 1.8;
const IMG_ASPECT = 2530 / 1280;

// Tiga level kartu: besar (3 pesan terbaru), sedang (3), kecil (3).
const LEVELS = {
  lg: {
    pad: "p-[1.1cqw]",
    text: "text-[length:clamp(0.75rem,1.15cqw,0.95rem)]",
    foot: "text-[length:clamp(0.65rem,0.9cqw,0.78rem)]",
    author: true,
  },
  md: {
    pad: "p-[0.9cqw]",
    text: "text-[length:clamp(0.68rem,1cqw,0.85rem)]",
    foot: "text-[length:clamp(0.62rem,0.85cqw,0.72rem)]",
    author: true,
  },
  sm: {
    pad: "p-[0.8cqw]",
    text: "text-[length:clamp(0.62rem,0.9cqw,0.78rem)]",
    foot: "text-[length:clamp(0.6rem,0.8cqw,0.7rem)]",
    author: false,
  },
};

// 9 kartu, urut dari pesan terbaru. x,y = pojok kiri atas; w,h = ukuran (persen panggung).
const CARDS = [
  { level: "lg", x: 16.5, y: 10.6, w: 17.2, h: 23.7 },
  { level: "lg", x: 61.9, y: 8.4, w: 17.2, h: 23.9 },
  { level: "lg", x: 14.4, y: 54.9, w: 17.0, h: 23.0 },
  { level: "md", x: 3.7, y: 33.6, w: 13.9, h: 19.9 },
  { level: "md", x: 62.6, y: 38.0, w: 13.9, h: 19.6 },
  { level: "md", x: 17.8, y: 79.8, w: 13.9, h: 19.7 },
  { level: "sm", x: 78.4, y: 31.9, w: 10.7, h: 15.5 },
  { level: "sm", x: 3.2, y: 63.3, w: 10.7, h: 15.5 },
  { level: "sm", x: 60.9, y: 78.0, w: 10.6, h: 15.5 },
];

// Pagar tajuk: pasangan [y, setengah lebar] dalam persen panggung. Perkiraan; setel bila perlu.
const CANOPY = [
  [22, 4],
  [30, 10],
  [40, 13.5],
  [50, 14.5],
  [60, 13],
  [67, 8],
];
const CANOPY_CENTER = 50;
const CANOPY_MIDDLE_Y = 44; // titik tengah tajuk, acuan kemiringan amplop polos
const CANOPY_MARGIN = 2.5; // jarak aman dari tepi daun

function halfWidth(y) {
  if (y <= CANOPY[0][0]) return CANOPY[0][1];
  for (let k = 1; k < CANOPY.length; k++) {
    const [y1, w1] = CANOPY[k - 1];
    const [y2, w2] = CANOPY[k];
    if (y <= y2) return w1 + ((w2 - w1) * (y - y1)) / (y2 - y1);
  }
  return CANOPY[CANOPY.length - 1][1];
}

const keepInside = ({ x, y }) => {
  const yy = Math.min(Math.max(y, 24), 64);
  const hw = Math.max(halfWidth(yy) - CANOPY_MARGIN, 0);
  return {
    x: Math.min(Math.max(x, CANOPY_CENTER - hw), CANOPY_CENTER + hw),
    y: yy,
  };
};

// 30 amplop di pohon (indeks = urutan pesan). 0-8 punya kartu, 9-29 amplop polos.
const RAW_CHIPS = [
  { x: 39.8, y: 28.6 },
  { x: 55.8, y: 28.6 },
  { x: 36.9, y: 52.6 },
  { x: 37.5, y: 41.2 },
  { x: 59.9, y: 47.3 },
  { x: 35.2, y: 60.9 },
  { x: 58.8, y: 38.1 },
  { x: 40.9, y: 63.0 },
  { x: 59.3, y: 58.9 },
  // amplop polos
  { x: 48.0, y: 34.1 },
  { x: 48.9, y: 39.8 },
  { x: 46.5, y: 43.2 },
  { x: 50.5, y: 25.5 },
  { x: 52.5, y: 32.5 },
  { x: 44.0, y: 34.5 },
  { x: 54.5, y: 42.5 },
  { x: 52.8, y: 37.0 },
  { x: 43.0, y: 38.5 },
  { x: 42.0, y: 46.0 },
  { x: 51.0, y: 46.5 },
  { x: 56.5, y: 51.0 },
  { x: 46.0, y: 50.0 },
  { x: 42.8, y: 55.0 },
  { x: 50.5, y: 54.0 },
  { x: 47.0, y: 58.5 },
  { x: 54.5, y: 60.5 },
  { x: 50.5, y: 62.0 },
  { x: 45.5, y: 63.0 },
  { x: 56.0, y: 55.5 },
  { x: 57.5, y: 33.5 },
];
const CHIPS = RAW_CHIPS.map(keepInside);

// Kemiringan amplop. Berkartu: sangat kecil. Polos: mengikuti lengkung tajuk
// (sisi kiri condong ke kiri, sisi kanan ke kanan, bawah condong keluar) ditambah variasi kecil.
const TILTS = CHIPS.map((c, i) => {
  if (i < CARDS.length) return ((i * 7) % 5) - 2; // -2..2 derajat
  const dx = c.x - CANOPY_CENTER;
  const dy = c.y - CANOPY_MIDDLE_Y;
  const arc = Math.max(
    -24,
    Math.min(24, dx * 1.6 + dy * Math.sign(dx || 1) * 0.5),
  );
  const jitter = ((i * 11) % 7) - 3; // -3..3 derajat
  return arc + jitter;
});

const COMPOSE = { x: 74.5, y: 58.3, w: 21.5, h: 26.5 };

// Tali: lengkung S dari amplop ke sisi kartu yang menghadap pohon (satuan viewBox 180 x 100).
const LINES = CARDS.map((c, i) => {
  const cx = CHIPS[i].x * STAGE_ASPECT;
  const cy = CHIPS[i].y;
  const cardIsLeft = c.x + c.w / 2 < CHIPS[i].x;
  const ax = (cardIsLeft ? c.x + c.w : c.x) * STAGE_ASPECT;
  const ay = c.y + c.h * 0.5;
  const mx = (cx + ax) / 2;
  return `M${cx} ${cy} C${mx} ${cy}, ${mx} ${ay}, ${ax} ${ay}`;
});

// Urutan muncul: dari amplop terdekat pusat pohon ke yang terjauh.
const CENTER = { x: 48, y: 42 };
const RANK = CHIPS.map((c, i) => ({
  i,
  d: Math.hypot(c.x - CENTER.x, (c.y - CENTER.y) * STAGE_ASPECT),
}))
  .sort((a, b) => a.d - b.d)
  .reduce((acc, { i }, r) => ((acc[i] = r), acc), []);
const chipStart = (i) => 0.05 + RANK[i] * (0.45 / CHIPS.length);
const cardStart = (i) => chipStart(i) + 0.18; // kartu muncul setelah amplopnya

// --o = seberapa "muncul" elemen (0..1), dari progres scroll --p dan titik mulai --start.
const reveal = (start) => ({
  "--start": start,
  "--o": "clamp(0, calc((var(--p) - var(--start)) * 4), 1)",
});

// Outline putih tipis (4 bayangan rapat) + bayangan lembut, supaya amplop tidak tersamar daun.
const CHIP_OUTLINE =
  "drop-shadow(0.12cqw 0 0 #fff) drop-shadow(-0.12cqw 0 0 #fff) drop-shadow(0 0.12cqw 0 #fff) drop-shadow(0 -0.12cqw 0 #fff) drop-shadow(0 0.25cqw 0.35cqw rgb(0 0 0 / 0.25))";

export default function TreeOfHopeDesktop({
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
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [active, setActive] = useState(null);
  useScrollProgress({ trackRef, stageRef, onDone: onReveal });
  const shown = messages.slice(0, CHIPS.length);
  const cardsShown = shown.slice(0, CARDS.length);

  return (
    <section
      ref={trackRef}
      className="hidden lg:block"
      style={{ height: "calc(100svh + 70svh)" }}
    >
      <div
        ref={stageRef}
        data-done="false"
        className="group/stage sticky top-0 h-svh overflow-hidden"
        style={{
          "--p": 0,
          "--tree-h":
            "max(22rem, min(calc(100svh - 17.5rem), calc(min(100vw - 2rem, 84rem) / 1.8)))",
        }}
      >
        {/* ===== Lapisan pohon (bottom-12 menyisakan strip kosong untuk pager) ===== */}
        <div
          className="absolute bottom-12 overflow-hidden will-change-transform [container-type:inline-size]"
          style={{
            width: "calc(var(--tree-h) * 1.8)",
            height: "var(--tree-h)",
            left: "calc(50% - var(--tree-h) * 0.9)",
            transformOrigin: "50% 100%",
            transform:
              "translateY(calc((1 - var(--p)) * var(--tree-h) * 0.01)) scale(calc(0.88 + 0.12 * var(--p)))",
          }}
        >
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

          {/* Tali penghubung: garis tipis transparan, di belakang amplop dan kartu */}
          <svg
            viewBox="0 0 180 100"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {cardsShown.map((m, i) => (
              <g key={m.id} style={reveal(chipStart(i) + 0.06)}>
                <path
                  d={LINES[i]}
                  pathLength="1"
                  fill="none"
                  strokeLinecap="round"
                  strokeWidth={active === i ? 0.4 : 0.22}
                  className={`${paletteOf(i).stroke} transition-[stroke-width] duration-200`}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: "calc(1 - var(--o))",
                    opacity: 0.45,
                  }}
                />
              </g>
            ))}
          </svg>

          {/* Amplop kecil: ikon langsung (tanpa kotak putih), miring mengikuti tajuk */}
          {shown.map((m, i) => {
            const plain = i >= CARDS.length;
            return (
              <button
                key={m.id}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => onOpen(i)}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-(--o) group-data-[done=false]/stage:pointer-events-none ${
                  plain ? "w-[2.3cqw] min-w-6" : "w-[2.8cqw] min-w-8"
                } ${paletteOf(i).text}`}
                style={{
                  left: `${CHIPS[i].x}%`,
                  top: `${CHIPS[i].y}%`,
                  scale: "calc(0.2 + 0.8 * var(--o))", // mulai kecil, membesar
                  rotate: `${TILTS[i]}deg`,
                  ...reveal(chipStart(i)),
                }}
              >
                <span
                  className={`relative block transition-transform duration-200 ${active === i ? "scale-125" : ""}`}
                  style={{ filter: CHIP_OUTLINE }}
                >
                  {m.id === pingId && (
                    <span className="absolute inset-0 animate-ping rounded-md bg-current opacity-30" />
                  )}
                  <EnvelopeIcon className="relative block h-auto w-full" />
                </span>
              </button>
            );
          })}

          {/* Kartu pratinjau: terbang keluar dari amplopnya sambil membesar */}
          {cardsShown.map((m, i) => {
            const card = CARDS[i];
            const lv = LEVELS[card.level];
            const p = paletteOf(i);
            const dx = CHIPS[i].x - (card.x + card.w / 2); // satuan cqw
            const dy = (CHIPS[i].y - (card.y + card.h / 2)) / STAGE_ASPECT; // tinggi % -> cqw
            return (
              <article
                key={m.id}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`absolute flex flex-col overflow-hidden rounded-[1.6cqw] border-2 bg-card text-card-foreground shadow-lg opacity-(--o) focus-within:opacity-100 group-data-[done=false]/stage:pointer-events-none ${lv.pad} ${p.border}`}
                style={{
                  left: `${card.x}%`,
                  top: `${card.y}%`,
                  width: `${card.w}%`,
                  height: `${card.h}%`,
                  scale: "calc(0.1 + 0.9 * var(--o))",
                  translate: `calc((1 - var(--o)) * ${dx}cqw) calc((1 - var(--o)) * ${dy}cqw)`,
                  ...reveal(cardStart(i)),
                }}
              >
                {m.id === newId && (
                  <span className="absolute right-2 top-2 rounded-full bg-svarati-coral-dark px-2 py-0.5 text-xs font-semibold text-white">
                    {t.newLabel}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onOpen(i)}
                  className="flex min-h-0 flex-1 cursor-pointer flex-col text-left"
                >
                  <span
                    className={`min-h-0 flex-1 overflow-hidden italic leading-snug [mask-image:linear-gradient(to_bottom,black_70%,transparent)] ${lv.text} ${p.text}`}
                  >
                    “{m.text}”
                  </span>
                </button>
                <div
                  className={`mt-[0.5cqw] flex items-center justify-between gap-2 border-t pt-[0.5cqw] ${lv.foot}`}
                >
                  {lv.author ? (
                    <span className={`min-w-0 truncate font-medium ${p.text}`}>
                      {m.author}
                    </span>
                  ) : (
                    <span />
                  )}
                  <LikeButton
                    compact
                    liked={m.liked}
                    count={m.supportCount}
                    onClick={() => onLike(m.id)}
                  />
                </div>
              </article>
            );
          })}

          {/* Amplop besar untuk menulis pesan */}
          <ComposeEnvelope
            onClick={onCompose}
            aspect={(COMPOSE.w * STAGE_ASPECT) / COMPOSE.h}
            className="absolute opacity-(--o) focus-visible:opacity-100 group-data-[done=false]/stage:pointer-events-none"
            textClassName="text-[length:clamp(0.8rem,1.4cqw,1.15rem)]"
            ctaClassName="text-[length:clamp(0.72rem,1.05cqw,0.95rem)]"
            style={{
              left: `${COMPOSE.x}%`,
              top: `${COMPOSE.y}%`,
              width: `${COMPOSE.w}%`,
              height: `${COMPOSE.h}%`,
              scale: "calc(0.94 + 0.06 * var(--o))",
              ...reveal(0.6),
            }}
          />
        </div>

        {/* ===== Judul ===== */}
        <header className="absolute inset-x-0 top-0 z-20 px-4 pt-22">
          <div className="relative mx-auto flex w-full max-w-[84rem] items-center justify-center">
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <BackLink />
            </div>
            <span className={INTRO_BADGE}>{t.badge}</span>
          </div>

          <h1
            className="mx-auto mt-3 max-w-3xl text-center font-bold leading-tight text-foreground"
            style={{ fontSize: "calc(3rem - 1.5rem * var(--p))" }}
          >
            {t.title}
          </h1>
          <p
            className="mx-auto mt-3 text-center leading-relaxed text-svarati-coral-dark"
            style={{
              fontSize: "calc(1.125rem - 0.25rem * var(--p))",
              maxWidth: "calc(42rem + 16rem * var(--p))",
            }}
          >
            {t.description}
          </p>

          {/* Satu slot di bawah description: "geser ke bawah" berubah jadi "klik pesan" setelah scroll */}
          <div className="pointer-events-none mt-1 grid justify-items-center">
            <span
              className="col-start-1 row-start-1 inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-svarati-teal/70"
              style={{ opacity: "clamp(0, calc(1 - var(--p) * 5), 1)" }}
            >
              {t.scrollHint}
              <ChevronDown
                className="h-4 w-4 animate-float-slow"
                aria-hidden="true"
              />
            </span>
            <span
              className="col-start-1 row-start-1 inline-flex items-center gap-2 px-4 py-1.5 text-center text-sm font-semibold text-svarati-teal/70"
              style={{ opacity: "clamp(0, calc((var(--p) - 0.15) * 5), 1)" }}
            >
              {t.moreMessages}
              <MousePointerClick
                className="h-4 w-4 animate-pulse"
                aria-hidden="true"
              />
            </span>
          </div>
        </header>

        {/* ===== Pager (di strip bawah pohon, tidak menimpa apa pun) ===== */}
        {totalPages > 1 && (
          <div
            className="absolute inset-x-0 bottom-1.5 z-20 flex justify-center group-data-[done=false]/stage:invisible"
            style={{ opacity: "clamp(0, calc((var(--p) - 0.8) * 5), 1)" }}
          >
            <div className="rounded-full bg-background/85 px-2 py-1 shadow backdrop-blur">
              <Pager
                page={page}
                totalPages={totalPages}
                onChange={onChangePage}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
