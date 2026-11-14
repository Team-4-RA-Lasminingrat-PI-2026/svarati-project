import { BackLink, INTRO_BADGE } from "@/app/rehabilitatif/tree-of-hope/_components/Intro";

// Tombol "< Pemulihan" dengan posisi yang sama persis dengan halaman Pohon Harapan (acuan).
// Strukturnya meniru Pohon Harapan: pembungkus halaman px-4, lalu
// - desktop (lg): header absolut pt-22, baris max-w-[84rem], tombol di kiri dan sejajar tengah dengan badge
// - HP/tablet: section max-w-xl pt-22, tombol di atas konten
// Pasang sebagai anak pertama <main className="relative ..."> yang memakai px-4 md:px-8 dan pt-24.
export default function BackToPemulihan() {
  return (
    <>
      {/* Desktop: melayang di atas konten, tidak menggeser tata letak halaman */}
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden px-4 lg:block">
        <div className="relative">
          <header className="absolute inset-x-0 top-0 z-20 px-4 pt-22">
            <div className="relative mx-auto flex w-full max-w-[84rem] items-center justify-center">
              <div className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2">
                <BackLink />
              </div>
              {/* Pengganti badge Pohon Harapan: tidak terlihat, hanya supaya tinggi barisnya sama */}
              <span aria-hidden="true" className={`invisible ${INTRO_BADGE}`}>&nbsp;</span>
            </div>
          </header>
        </div>
      </div>

      {/* HP/tablet: padding <main> dibatalkan dulu supaya titik awalnya sama dengan Pohon Harapan */}
      <div className="-mx-4 -mt-24 mb-5 px-4 md:-mx-8 lg:hidden">
        <section className="mx-auto flex max-w-xl flex-col pt-22">
          <div>
            <BackLink />
          </div>
        </section>
      </div>
    </>
  );
}
