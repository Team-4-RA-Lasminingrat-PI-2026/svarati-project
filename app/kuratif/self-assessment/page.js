"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Lock, ShieldAlert } from "lucide-react";
import { DARURAT, KURATIF, MENU_UTAMA } from "@/content/labels";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/Card";
import Badge from "@/components/Badge";
import ProgressBar from "@/components/ProgressBar";
import Split from "@/components/kuratif/Split";
import NomorDarurat from "@/components/kuratif/NomorDarurat";
import Hasil from "@/components/kuratif/Hasil";

const common = KURATIF.common;
const quiz = KURATIF.selfAssessment;
const namaKuis = MENU_UTAMA.find((m) => m.id === "pendampingan").submenu.find((s) => s.id === "cek-kondisi").nama;

// Panel kiri untuk layar darurat dan edukasi: hanya badge dan judul
const asideSingkat = (
  <>
    <Badge variant="teal">{namaKuis}</Badge>
    <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-svarati-teal">
      {quiz.panelKiri.judul}
    </h2>
  </>
);

// Kartu besar untuk layar darurat (merah) dan edukasi (teal)
function KartuBesar({ danger, Icon, title, body, headingRef, children }) {
  const warna = danger ? "text-svarati-danger" : "text-svarati-teal";
  return (
    <Card
      variant={danger ? "coral" : "teal"}
      className={`p-6 sm:p-8 ${danger ? "border-2 border-svarati-danger/40" : ""}`}
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white ${warna}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`mt-4 text-2xl font-bold leading-snug focus:outline-none ${warna}`}
      >
        {title}
      </h1>
      <p className="mt-3 leading-relaxed text-svarati-teal">{body}</p>
      {children}
    </Card>
  );
}

export default function SelfAssessmentPage() {
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [view, setView] = useState("quiz"); // quiz | darurat | edukasi | hasil

  // Fokus pindah ke judul setiap ganti langkah atau layar (untuk pembaca layar)
  const headingRef = useRef(null);
  const sudahTampil = useRef(false);
  useEffect(() => {
    if (!sudahTampil.current) {
      sudahTampil.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [index, view]);

  const questions = quiz.questions;
  const q = questions[index];
  const selected = answers[q.id];
  const bisaLanjut = q.multi ? (selected || []).length > 0 : !!selected;
  const grup = q.multi ? [...new Set(q.options.map((o) => o.group))] : [null];

  // Pilihan biasa langsung disimpan. Jika ada flag (darurat/edukasi), layar langsung pindah.
  // Pilihan banyak menambah atau menghapus dari daftar.
  function pilih(option) {
    if (q.multi) {
      setAnswers((prev) => {
        const daftar = prev[q.id] || [];
        return {
          ...prev,
          [q.id]: daftar.includes(option.id)
            ? daftar.filter((id) => id !== option.id)
            : [...daftar, option.id],
        };
      });
      return;
    }
    setAnswers((prev) => ({ ...prev, [q.id]: option.id }));
    if (option.flag) setView(option.flag);
  }

  function lanjut() {
    if (index < questions.length - 1) setIndex(index + 1);
    else setView("hasil");
  }

  function lewati() {
    setAnswers((prev) => ({ ...prev, [q.id]: null }));
    lanjut();
  }

  function ulangi() {
    setAnswers({});
    setIndex(0);
    setView("quiz");
  }

  if (view === "hasil") {
    return <Hasil answers={answers} headingRef={headingRef} onUlangi={ulangi} />;
  }

  if (view === "darurat") {
    return (
      <Split aside={asideSingkat}>
        <KartuBesar
          danger
          Icon={ShieldAlert}
          title={quiz.darurat.judul}
          body={quiz.darurat.isi}
          headingRef={headingRef}
        >
          <NomorDarurat lengkap className="mt-6 grid gap-3" />
          <p className="mt-5 text-sm leading-relaxed text-svarati-teal">
            {quiz.darurat.keluarCepatAwal} <span className="font-bold">{DARURAT.keluarCepat}</span>{" "}
            {quiz.darurat.keluarCepatAkhir}
          </p>
          <Button variant="tertiary" size="lg" className="mt-4 text-sm" onClick={() => setView("quiz")}>
            {common.backToQuiz}
          </Button>
        </KartuBesar>
      </Split>
    );
  }

  if (view === "edukasi") {
    return (
      <Split aside={asideSingkat}>
        <KartuBesar
          Icon={BookOpen}
          title={quiz.education.judul}
          body={quiz.education.isi}
          headingRef={headingRef}
        >
          <div className="mt-6 flex items-center gap-4">
            <Link
              href={quiz.education.route}
              className={`${buttonVariants({ variant: "secondary", size: "lg" })} flex-1`}
            >
              {quiz.education.tombol}
              <ArrowRight aria-hidden="true" className="ml-1.5" />
            </Link>
            <Button variant="tertiary" size="lg" onClick={() => setView("quiz")}>
              {common.backToQuiz}
            </Button>
          </div>
        </KartuBesar>
      </Split>
    );
  }

  // ===== Kuis =====
  return (
    <Split
      aside={
        <>
          <Badge variant="teal">{namaKuis}</Badge>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-svarati-teal">
            {quiz.panelKiri.judulKuis}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-svarati-teal">
            {quiz.panelKiri.dukungan}
          </p>
          <div className="mt-6">
            <ProgressBar
              value={index + 1}
              max={questions.length}
              label={quiz.title(index + 1, questions.length)}
            />
          </div>
        </>
      }
    >
      <div className="rounded-3xl border border-svarati-lavender-light bg-white p-6 shadow-sm sm:p-8">
        <h1
          id="pertanyaan"
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-bold leading-snug text-svarati-teal focus:outline-none"
        >
          {q.text}
        </h1>
        {q.multi && <p className="mt-2 text-sm text-svarati-lavender-dark">{quiz.hint}</p>}

        <div role="group" aria-labelledby="pertanyaan" className="mt-6 grid gap-3">
          {grup.map((namaGrup) => (
            <div key={namaGrup ?? "biasa"} className="grid gap-3">
              {namaGrup && (
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-svarati-lavender-dark">
                  {namaGrup}
                </p>
              )}
              {q.options
                .filter((o) => !namaGrup || o.group === namaGrup)
                .map((option) => {
                  const checked = q.multi
                    ? (selected || []).includes(option.id)
                    : selected === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex min-h-[60px] cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition duration-200 ${
                        checked
                          ? "border-svarati-teal bg-svarati-teal-soft"
                          : "border-svarati-lavender-light bg-white hover:border-svarati-lavender-dark/40 hover:bg-svarati-lavender-light/30"
                      }`}
                    >
                      <input
                        type={q.multi ? "checkbox" : "radio"}
                        name={q.id}
                        checked={checked}
                        onChange={() => pilih(option)}
                        className="h-5 w-5 shrink-0 cursor-pointer accent-svarati-teal"
                      />
                      <span className="leading-snug text-svarati-teal">{option.label}</span>
                    </label>
                  );
                })}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          {index > 0 && (
            <Button
              variant="ghost"
              size="lg"
              className="flex-1"
              icon={<ArrowLeft aria-hidden="true" />}
              onClick={() => setIndex(index - 1)}
            >
              {common.back}
            </Button>
          )}
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 bg-svarati-teal text-white hover:bg-svarati-teal-light disabled:bg-svarati-teal disabled:opacity-40"
            icon={<ArrowRight aria-hidden="true" />}
            iconPosition="right"
            disabled={!bisaLanjut}
            onClick={lanjut}
          >
            {index === questions.length - 1 ? common.finish : common.next}
          </Button>
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="tertiary" size="lg" className="text-sm" onClick={lewati}>
            {common.skip}
          </Button>
        </div>
      </div>

      <Card variant="coral" className="mt-3 flex items-start gap-2 p-4 text-sm text-svarati-coral-dark">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{common.storageNote}</span>
      </Card>
    </Split>
  );
}