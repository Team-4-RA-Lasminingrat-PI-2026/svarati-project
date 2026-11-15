"use client";

import { useRef, useState } from "react";
import { Mail } from "lucide-react";
import { treeOfHopeContent as t } from "@/content/labels";
import { Card, CardDescription, CardFooter } from "@/components/Card";
import Badge from "@/components/Badge";
import { BackLink } from "./Intro";
import useScrollProgress from "../hooks/useScrollProgress";
import { ChevronDownIcon } from "./icons";
import ComposeEnvelope from "./ComposeEnvelope";
import LikeButton from "./LikeButton";
import Pager from "./Pager";

// Panggung berrasio tetap 1.8. Semua koordinat = persen panggung (1% lebar = 1 satuan --u).
const STAGE_ASPECT = 1.8;
const IMG_ASPECT = 2530 / 1280;

// Tiga level kartu: besar (3 pesan terbaru), sedang (3), kecil (3).
// Ukuran huruf diatur di globals.css (.toh-t-* untuk teks, .toh-f-* untuk footer).
const LEVELS = {
  lg: {
    pad: "p-[calc(var(--u)*1.2)]",
    text: "toh-t-lg",
    foot: "toh-f-lg",
    author: true,
  },
  md: {
    pad: "p-[calc(var(--u)*1)]",
    text: "toh-t-md",
    foot: "toh-f-md",
    author: true,
  },
  sm: {
    pad: "p-[calc(var(--u)*0.85)]",
    text: "toh-t-sm",
    foot: "toh-f-sm",
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
const CARD_ROT = [-2, 2, 1, -1.5, 1.5, 1, 2, -2, 1.5]; // kemiringan kartu (derajat)
const CARD_N = CARDS.length;

// Pagar tajuk: pasangan [y, setengah lebar]. Pengaman agar amplop tidak keluar dari daun.
const CANOPY = [
  [22, 4],
  [30, 10],
  [40, 13.5],
  [50, 14.5],
  [60, 13],
  [67, 8],
];
const CANOPY_CENTER = 50;
const CANOPY_MIDDLE_Y = 44;
const CANOPY_MARGIN = 2.5;

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

// Amplop pemilik 9 kartu (indeks 0-8)
const CARD_CHIPS = [
  { x: 39.8, y: 28.6 },
  { x: 55.8, y: 28.6 },
  { x: 36.9, y: 52.6 },
  { x: 37.5, y: 41.2 },
  { x: 59.9, y: 47.3 },
  { x: 35.2, y: 60.9 },
  { x: 58.8, y: 38.1 },
  { x: 43.2, y: 63.0 },
  { x: 59.3, y: 58.9 },
];

// 21 amplop kecil tanpa kartu (indeks 9-29), urut dari dekat pusat ke tepi.
// Koordinat dihitung agar tersebar natural, tidak bertumpuk, dan tetap di dalam daun.
// Mau menggeser satu amplop? Ubah x (kiri-kanan) dan y (atas-bawah) di sini.
const PLAIN_CHIPS = [
  { x: 48.2, y: 40.0 },
  { x: 49.0, y: 46.4 },
  { x: 44.8, y: 39.4 },
  { x: 45.6, y: 46.8 },
  { x: 51.6, y: 40.9 },
  { x: 50.6, y: 35.0 },
  { x: 47.0, y: 32.1 },
  { x: 52.1, y: 48.9 },
  { x: 54.6, y: 44.4 },
  { x: 42.1, y: 47.8 },
  { x: 45.3, y: 53.6 },
  { x: 54.5, y: 36.4 },
  { x: 49.2, y: 55.0 },
  { x: 41.4, y: 35.3 },
  { x: 53.7, y: 54.4 },
  { x: 46.5, y: 25.6 },
  { x: 49.9, y: 25.2 },
  { x: 41.5, y: 55.0 },
  { x: 56.9, y: 51.6 },
  { x: 56.2, y: 61.7 },
  { x: 61.5, y: 53.5 },
];

const CHIPS = [...CARD_CHIPS, ...PLAIN_CHIPS].map(keepInside); // 30 amplop

// Kemiringan amplop: berkartu sangat kecil; polos mengikuti lengkung tajuk.
const TILTS = CHIPS.map((c, i) => {
  if (i < CARD_N) return ((i * 7) % 5) - 2;
  const dx = c.x - CANOPY_CENTER;
  const dy = c.y - CANOPY_MIDDLE_Y;
  const arc = Math.max(
    -24,
    Math.min(24, dx * 1.6 + dy * Math.sign(dx || 1) * 0.5),
  );
  return arc + (((i * 11) % 7) - 3);
});

// Amplop besar "Kirim pesan dukungan". Ukuran huruf diatur di globals.css (.toh-compose).
const COMPOSE = { x: 74.5, y: 58.3, w: 21.5, h: 26.5 };

// Tali coral: lengkung dari amplop ke titik gantung di atas kartu, lalu tali tegak ke kartu.
// Satuan viewBox 180 x 100 (rasio sama dengan panggung).
const ROPES = CARDS.map((c, i) => {
  const ex = CHIPS[i].x * STAGE_ASPECT;
  const ey = CHIPS[i].y;
  const ax = (c.x + c.w / 2) * STAGE_ASPECT;
  const ay = Math.min(CHIPS[i].y, Math.max(c.y - 5, 2.5));
  const mx = (ex + ax) / 2;
  return {
    ax,
    ay,
    top: c.y,
    d: `M${ex} ${ey} Q${mx} ${Math.max(ay - 4, 0.5)} ${ax} ${ay}`,
  };
});

// Urutan muncul: kartu dan amplop kecil masing-masing dari yang terdekat pusat pohon.
const CENTER = { x: 48, y: 42 };
const distFromCenter = (i) =>
  Math.hypot(CHIPS[i].x - CENTER.x, (CHIPS[i].y - CENTER.y) / STAGE_ASPECT);
const RANK = [];
[
  [0, CARD_N],
  [CARD_N, CHIPS.length],
].forEach(([from, to]) => {
  Array.from({ length: to - from }, (_, k) => from + k)
    .sort((a, b) => distFromCenter(a) - distFromCenter(b))
    .forEach((id, r) => (RANK[id] = r));
});
const PLAIN_N = CHIPS.length - CARD_N;
// Kartu: 0.04-0.24. Amplop kecil: 0.10-0.50. Semuanya penuh sebelum progres 0.85.
const chipStart = (i) =>
  i < CARD_N ? 0.04 + RANK[i] * 0.025 : 0.1 + (RANK[i] / (PLAIN_N - 1)) * 0.4;
const cardStart = (i) => chipStart(i) + 0.16;

// --o = seberapa "muncul" elemen (0..1), dari progres scroll --p dan titik mulai --start.
const reveal = (start) => ({
  "--start": start,
  "--o": "clamp(0, calc((var(--p) - var(--start)) * 4), 1)",
});

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
  const cardsShown = shown.slice(0, CARD_N);

  return (
    <section
      ref={trackRef}
      className="hidden lg:block"
      style={{ height: "calc(100svh + 70svh)" }}
    >
      <div
        ref={stageRef}
        data-done="false"
        className="toh-stage group/stage sticky top-0 h-svh overflow-hidden"
        style={{ "--p": 0 }}
      >
        {/* ===== Lapisan pohon ===== */}
        <div className="toh-tree">
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

          {/* Tali coral (di belakang amplop dan kartu) */}
          <svg
            viewBox="0 0 180 100"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {cardsShown.map((m, i) => (
              <g
                key={m.id}
                className="fill-none stroke-svarati-coral-darker/70"
              >
                <g style={reveal(chipStart(i) + 0.06)}>
                  <path
                    d={ROPES[i].d}
                    pathLength="1"
                    strokeWidth={active === i ? 0.5 : 0.35}
                    strokeLinecap="round"
                    className="transition-[stroke-width] duration-200"
                    style={{
                      strokeDasharray: 1,
                      strokeDashoffset: "calc(1 - var(--o))",
                    }}
                  />
                </g>
                <g style={reveal(cardStart(i))}>
                  <line
                    x1={ROPES[i].ax}
                    y1={ROPES[i].ay}
                    x2={ROPES[i].ax}
                    y2={ROPES[i].top}
                    strokeWidth="0.3"
                    style={{ opacity: "var(--o)" }}
                  />
                  <circle
                    cx={ROPES[i].ax}
                    cy={ROPES[i].ay}
                    r="0.9"
                    strokeWidth="0.4"
                    className="fill-white"
                    style={{ opacity: "var(--o)" }}
                  />
                </g>
              </g>
            ))}
          </svg>

          {/* Amplop kecil coral-putih: mulai kecil lalu membesar */}
          {shown.map((m, i) => {
            const plain = i >= CARD_N;
            return (
              <button
                key={m.id}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => onOpen(i)}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-(--o) group-data-[done=false]/stage:pointer-events-none"
                style={{
                  left: `${CHIPS[i].x}%`,
                  top: `${CHIPS[i].y}%`,
                  width: plain
                    ? "max(1.35rem, calc(var(--u) * 2.1))"
                    : "max(1.6rem, calc(var(--u) * 2.6))",
                  scale: "calc(0.2 + 0.8 * var(--o))",
                  rotate: `${TILTS[i]}deg`,
                  ...reveal(chipStart(i)),
                }}
              >
                <span
                  className={`relative flex aspect-square items-center justify-center rounded-[22%] border border-svarati-coral-dark/60 bg-white shadow-md transition-transform duration-200 ${
                    active === i ? "scale-125" : ""
                  }`}
                >
                  {m.id === pingId && (
                    <span
                      className="absolute -inset-1 animate-ping rounded-lg bg-svarati-coral/50"
                      aria-hidden="true"
                    />
                  )}
                  <Mail
                    className="relative size-[58%] text-svarati-coral-dark"
                    aria-hidden="true"
                  />
                </span>
              </button>
            );
          })}

          {/* Kartu pratinjau (component Card): terbang keluar dari amplopnya */}
          {cardsShown.map((m, i) => {
            const card = CARDS[i];
            const lv = LEVELS[card.level];
            const dx = CHIPS[i].x - (card.x + card.w / 2); // satuan --u
            const dy = (CHIPS[i].y - (card.y + card.h / 2)) / STAGE_ASPECT;
            return (
              <Card
                key={m.id}
                variant="white"
                size="sm"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`absolute z-30 flex flex-col rounded-[calc(var(--u)*1.6)] shadow-lg transition-none opacity-(--o) focus-within:opacity-100 group-data-[done=false]/stage:pointer-events-none ${lv.pad}`}
                style={{
                  left: `${card.x}%`,
                  top: `${card.y}%`,
                  width: `${card.w}%`,
                  height: `${card.h}%`,
                  rotate: `${CARD_ROT[i]}deg`,
                  scale: "calc(0.1 + 0.9 * var(--o))",
                  translate: `calc((1 - var(--o)) * ${dx.toFixed(2)} * var(--u)) calc((1 - var(--o)) * ${dy.toFixed(2)} * var(--u))`,
                  ...reveal(cardStart(i)),
                }}
              >
                {/* Tombol transparan: seluruh kartu bisa diklik untuk membaca pesan lengkap */}
                <button
                  type="button"
                  onClick={() => onOpen(i)}
                  aria-label={t.reader.readFull(m.author)}
                  className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] focus-visible:-outline-offset-3"
                />
                {m.id === newId && (
                  <span className="pointer-events-none absolute right-2 top-2 z-20 rounded-full bg-svarati-coral-dark px-2 py-0.5 text-xs font-semibold text-white">
                    {t.newLabel}
                  </span>
                )}
                <CardDescription
                  className={`min-h-0 flex-1 overflow-hidden break-words italic leading-snug text-svarati-coral-dark [mask-image:linear-gradient(to_bottom,black_70%,transparent)] ${lv.text}`}
                >
                  “{m.text}”
                </CardDescription>
                <CardFooter
                  className={`mt-[calc(var(--u)*0.5)] gap-2 pt-[calc(var(--u)*0.5)] ${lv.foot}`}
                >
                  {lv.author ? (
                    <span className="min-w-0 truncate text-svarati-lavender-dark">
                      {m.author}
                    </span>
                  ) : (
                    <span />
                  )}
                  {/* z-20: tombol love berada di atas tombol penutup kartu, jadi bisa diklik langsung */}
                  <div className="relative z-20 shrink-0">
                    <LikeButton
                      compact
                      liked={m.liked}
                      count={m.supportCount}
                      onClick={() => onLike(m.id)}
                    />
                  </div>
                </CardFooter>
              </Card>
            );
          })}

          {/* Amplop besar untuk menulis pesan (ukuran huruf: .toh-compose di globals.css) */}
          <ComposeEnvelope
            onClick={onCompose}
            className="toh-compose absolute z-40 opacity-(--o) focus-visible:opacity-100 group-data-[done=false]/stage:pointer-events-none"
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

        {/* ===== Header atau Judul ===== */}
        <header
          className="absolute inset-x-0 top-0 z-20 px-4"
          style={{ paddingTop: "var(--toh-top)" }}
        >
          <div className="relative mx-auto flex w-full max-w-[84rem] items-center justify-center">
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <BackLink />
            </div>
            <Badge variant="coral" styleType="soft">
              {t.badge}
            </Badge>
          </div>
          <h1 className="toh-title mx-auto mt-3 max-w-3xl text-balance text-center font-bold leading-tight text-svarati-teal">
            {t.title}
          </h1>
          <p className="toh-desc mx-auto mt-3 text-center leading-relaxed text-svarati-coral-dark">
            {t.description}
          </p>

          {/* "Geser ke bawah" berubah menjadi "Klik pesan atau amplop..." saat pohon terbuka
              (ukuran huruf: .toh-hint di globals.css) */}
          <div className="toh-hint pointer-events-none mx-auto mt-3 grid place-items-center font-medium text-svarati-lavender-dark">
            <div
              className="col-start-1 row-start-1 flex flex-col items-center gap-1"
              style={{ opacity: "clamp(0, calc(1 - var(--p) * 4), 1)" }}
            >
              {t.scrollHint}
              <ChevronDownIcon className="h-5 w-5 animate-float-slow" />
            </div>
            <p
              className="col-start-1 row-start-1 text-center"
              style={{ opacity: "clamp(0, calc((var(--p) - 0.55) * 4), 1)" }}
            >
              {t.moreMessages}
            </p>
          </div>
        </header>

        {/* ===== Pager ===== */}
        {totalPages > 1 && (
          <div
            className="absolute inset-x-0 bottom-3 z-20 flex justify-center group-data-[done=false]/stage:invisible"
            style={{ opacity: "clamp(0, calc((var(--p) - 0.8) * 5), 1)" }}
          >
            <div className="rounded-full bg-background/85 p-1 shadow backdrop-blur">
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