// Membuat PDF jurnal pemulihan di dalam browser.
//
// Seluruh proses berjalan di perangkat pengguna. Isi jurnal tidak pernah
// dikirim ke server mana pun, sama seperti penyimpanannya di localStorage.
//
// jsPDF diimpor secara dinamis supaya hanya terunduh saat pengguna benar-benar
// menekan tombol unduh, bukan ikut dalam bundel halaman.

import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

// Lebar A4 potret dalam milimeter, dipakai sebagai satuan di seluruh berkas ini
const HALAMAN_LEBAR = 210;
const HALAMAN_TINGGI = 297;
const MARGIN = 18;
const LEBAR_ISI = HALAMAN_LEBAR - MARGIN * 2;

/**
 * Menggabungkan mood dan catatan menjadi satu daftar entri, terurut dari
 * tanggal terlama. Tanggal yang tidak punya mood maupun catatan dilewati.
 *
 * Draf yang belum ditekan "Simpan catatan" sengaja tidak diikutkan: yang
 * diunduh hanya apa yang sudah pengguna pilih untuk disimpan.
 *
 * @param {Record<string, string>} moodHistory  { "yyyy-MM-dd": emoji }
 * @param {Record<string, string>} noteHistory  { "yyyy-MM-dd": teks }
 * @param {(emoji: string) => string} labelMood  emoji -> "Marah", "Sedih", ...
 */
export function kumpulkanEntri(moodHistory, noteHistory, labelMood) {
    const kunci = new Set([...Object.keys(moodHistory), ...Object.keys(noteHistory)]);

    return [...kunci]
        .sort() // format yyyy-MM-dd aman diurutkan sebagai teks
        .map((k) => ({
            kunci: k,
            tanggal: format(parseISO(k), "EEEE, d MMMM yyyy", { locale: id }),
            mood: moodHistory[k] ? labelMood(moodHistory[k]) : null,
            catatan: noteHistory[k] ?? "",
        }));
}

/**
 * Nama berkas unduhan.
 *
 * Sengaja tidak memuat kata "jurnal" atau "pemulihan". Berkas ini tersimpan di
 * folder unduhan perangkat dan bisa terlihat orang lain, jadi namanya dibuat
 * netral. Periodenya pakai angka (yyyy-MM) supaya berkas berurut sendiri saat
 * folder diurutkan berdasarkan nama.
 *
 * @param {Array} entri  hasil kumpulkanEntri, sudah terurut
 */
export function namaBerkas(entri = []) {
    if (entri.length === 0) return "catatan.pdf";

    const awal = entri[0].kunci.slice(0, 7);
    const akhir = entri[entri.length - 1].kunci.slice(0, 7);
    return awal === akhir ? `catatan-${awal}.pdf` : `catatan-${awal}-sd-${akhir}.pdf`;
}

/**
 * Judul periode yang tampil di dalam dokumen.
 */
export function labelPeriode(entri = []) {
    if (entri.length === 0) return "";

    const awal = format(parseISO(entri[0].kunci), "MMMM yyyy", { locale: id });
    const akhir = format(parseISO(entri[entri.length - 1].kunci), "MMMM yyyy", { locale: id });
    return awal === akhir ? awal : `${awal} sampai ${akhir}`;
}

/**
 * Membuat dan mengunduh PDF.
 *
 * Mood ditulis sebagai label ("Marah", "Sedih"), bukan emoji, karena font
 * bawaan jsPDF tidak punya glif emoji dan hasilnya akan jadi kotak kosong.
 *
 * @returns {Promise<void>} selesai setelah berkas diserahkan ke browser
 */
export async function unduhPdf({ entri, judulPeriode, namaFile }) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    let y = MARGIN;

    // Pindah halaman kalau sisa ruang tidak cukup untuk blok setinggi `butuh`
    const pastikanRuang = (butuh) => {
        if (y + butuh <= HALAMAN_TINGGI - MARGIN) return;
        doc.addPage();
        y = MARGIN;
    };

    const tulis = (teks, { ukuran = 11, tebal = false, jarakAtas = 0, warna = [15, 76, 92] }) => {
        doc.setFontSize(ukuran);
        doc.setFont("helvetica", tebal ? "bold" : "normal");
        doc.setTextColor(...warna);

        const baris = doc.splitTextToSize(teks, LEBAR_ISI);
        const tinggiBaris = ukuran * 0.5; // mm, cukup lega untuk teks Indonesia

        y += jarakAtas;
        for (const satuBaris of baris) {
            pastikanRuang(tinggiBaris);
            doc.text(satuBaris, MARGIN, y);
            y += tinggiBaris;
        }
    };

    // Kepala dokumen
    tulis("Jurnal Pemulihan", { ukuran: 20, tebal: true });
    if (judulPeriode) tulis(judulPeriode, { ukuran: 12, jarakAtas: 2, warna: [90, 120, 130] });
    tulis(`Diunduh ${format(new Date(), "d MMMM yyyy", { locale: id })}`, {
        ukuran: 9,
        jarakAtas: 1,
        warna: [120, 140, 148],
    });

    y += 4;
    doc.setDrawColor(216, 209, 243);
    pastikanRuang(6);
    doc.line(MARGIN, y, HALAMAN_LEBAR - MARGIN, y);
    y += 8;

    // Isi
    if (entri.length === 0) {
        tulis("Belum ada catatan pada periode ini.", { warna: [120, 140, 148] });
    } else {
        for (const e of entri) {
            // Jaga supaya tanggal tidak tertinggal sendirian di bawah halaman
            pastikanRuang(18);

            tulis(e.tanggal, { ukuran: 12, tebal: true, jarakAtas: 4 });
            if (e.mood) tulis(`Perasaan: ${e.mood}`, { ukuran: 10, jarakAtas: 1, warna: [192, 80, 47] });
            if (e.catatan) tulis(e.catatan, { ukuran: 11, jarakAtas: 2 });
            else if (!e.mood) tulis("(tidak ada catatan)", { ukuran: 10, warna: [120, 140, 148] });
        }
    }

    // Kaki tiap halaman
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i += 1) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(140, 155, 162);
        doc.text(
            "Dokumen ini dibuat di perangkatmu dan tidak dikirim ke mana pun.",
            MARGIN,
            HALAMAN_TINGGI - 10,
        );
        doc.text(`${i} / ${total}`, HALAMAN_LEBAR - MARGIN, HALAMAN_TINGGI - 10, { align: "right" });
    }

    doc.save(namaFile);
}
