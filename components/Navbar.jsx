"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import QuickOutButton from "@/components/QuickOutButton";
import { BRAND, DARURAT, MENU_UTAMA, NAVBAR } from "@/content/labels";
//Tambahan import untuk EmergencyModal-Gaby19Oct
import EmergencyModal from "@/components/modals/EmergencyModal";

const isActive = (pathname, href) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

const hasSubmenu = (item) => item.submenu?.length > 0;

// Pilar aktif jika halaman pilar itu sendiri atau salah satu sub-halamannya sedang dibuka
const isPillarActive = (pathname, item) =>
  isActive(pathname, item.href) ||
  (hasSubmenu(item) && item.submenu.some((sub) => isActive(pathname, sub.href)));

const STATE = {
  active: "bg-svarati-teal text-white",
  idle: "text-svarati-teal hover:bg-svarati-teal/10",
};

const BAR = "block h-0.5 w-6 bg-svarati-teal transition";

// Link sub-halaman, dipakai di mobile dan desktop
function SubLink({ sub, pathname, onClick }) {
  const active = isActive(pathname, sub.href);

  return (
    <Link
      href={sub.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active ? STATE.active : STATE.idle
      }`}
    >
      {sub.nama}
    </Link>
  );
}

// Item mobile: judul pilar adalah link ke halamannya, panah membuka submenu
function NavItem({ item, pathname, isOpen, onToggle, onNavigate }) {
  const active = isPillarActive(pathname, item);
  const rowBase = `flex w-full items-center justify-between rounded-2xl text-sm font-semibold transition ${
    active ? STATE.active : STATE.idle
  }`;

  if (!hasSubmenu(item)) {
    return (
      <li>
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={`${rowBase} px-4 py-2.5`}
        >
          {item.nama}
        </Link>
      </li>
    );
  }

  const submenuId = `submenu-${item.id}`;

  return (
    <li>
      <div className={rowBase}>
        {/* Judul pilar: klik untuk membuka halaman pilar */}
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className="flex-1 rounded-2xl px-4 py-2.5"
        >
          {item.nama}
        </Link>

        {/* Panah: hanya membuka/menutup submenu */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={isOpen ? submenuId : undefined}
          aria-label={`${isOpen ? "Tutup" : "Buka"} submenu ${item.nama}`}
          className="px-4 py-2.5"
        >
          <span
            aria-hidden="true"
            className={`inline-block text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>
      </div>

      {isOpen && (
        <ul id={submenuId} className="mt-1 space-y-1 pb-1 pl-4 pr-2">
          {item.submenu.map((sub) => (
            <li key={sub.id}>
              <SubLink sub={sub} pathname={pathname} onClick={onNavigate} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// Item desktop: pilar adalah link ke halamannya, submenu muncul saat hover atau fokus Tab
function DesktopItem({ item, pathname }) {
  const active = isPillarActive(pathname, item);
  const triggerClass = `flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide transition-all ${
    active ? `scale-105 shadow-md ${STATE.active}` : STATE.idle
  }`;

  if (!hasSubmenu(item)) {
    return (
      <li>
        <Link href={item.href} aria-current={active ? "page" : undefined} className={triggerClass}>
          {item.nama}
        </Link>
      </li>
    );
  }

  return (
    <li className="group relative">
      {/* Pilar sekarang adalah link ke halamannya sendiri */}
      <Link href={item.href} aria-current={active ? "page" : undefined} className={triggerClass}>
        {item.nama}
        <span aria-hidden="true" className="ml-1 text-[10px]">▼</span>
      </Link>

      {/* pt-1 menjembatani celah antara tombol dan dropdown agar hover tidak terputus */}
      <div className="invisible absolute left-0 top-full z-50 min-w-48 pt-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="rounded-2xl border border-svarati-teal/10 bg-white p-2 shadow-lg">
          {item.submenu.map((sub) => (
            <li key={sub.id}>
              <SubLink sub={sub} pathname={pathname} />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openPillarId, setOpenPillarId] = useState(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const pathname = usePathname();

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenPillarId(null);
  };

  const togglePillar = (id) => setOpenPillarId(openPillarId === id ? null : id);

  return (
    <>
    <header className="fixed inset-x-0 top-3 z-40 overflow-x-clip px-2 sm:px-3">
      <nav
        aria-label={NAVBAR.navigasiUtama}
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-svarati-teal/20 bg-white px-4 py-1 shadow-xl sm:gap-3 sm:px-5 lg:gap-4 lg:px-6"
      >
        {/* Brand */}
        <Link
          href="/"
          aria-label={`${BRAND.nama}, ke beranda`}
          className="group flex shrink-0 select-none items-center gap-2.5 px-1 py-1"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-svarati-lavender-light transition-all group-hover:bg-svarati-lavender-hover">
            <Image
              src="/images/logo.png"
              alt=""
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
          {/* Disembunyikan di layar sangat sempit agar tombol darurat tidak terpotong */}
          <span className="hidden items-baseline text-xl font-bold leading-none tracking-tight text-svarati-teal min-[400px]:flex">
            {BRAND.nama}
            <span className="ml-0.5 text-2xl font-bold leading-none text-svarati-coral">.</span>
          </span>
        </Link>

        {/* Menu desktop */}
        <ul className="hidden items-center gap-1 rounded-full border border-svarati-teal/10 bg-svarati-teal/5 p-1 lg:flex">
          {MENU_UTAMA.map((item) => (
            <DesktopItem key={item.id} item={item} pathname={pathname} />
          ))}
        </ul>

        {/* Tombol utilitas */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* EmergencyModal belum dibuat: tombol ini akan membuka pop-up darurat nanti. */}
          <Button
            type="button"
            onClick={() => setEmergencyOpen(true)}
            className="motion-safe:animate-darurat-glow h-auto gap-1 whitespace-nowrap rounded-full bg-svarati-danger px-3 py-2.5 text-xs font-bold text-white shadow-md hover:bg-svarati-danger-dark sm:gap-2 sm:px-4 sm:text-sm"
          >
            <span aria-hidden="true">⚡</span>
            <span className="sm:hidden">{DARURAT.tombolRingkas}</span>
            <span className="hidden sm:inline">{DARURAT.tombol}</span>
          </Button>

          <QuickOutButton />

          <Button
            type="button"
            variant="ghost"
            onClick={() => (mobileOpen ? closeMobile() : setMobileOpen(true))}
            aria-label={mobileOpen ? NAVBAR.tutupMenu : NAVBAR.bukaMenu}
            aria-expanded={mobileOpen}
            aria-controls={mobileOpen ? "menu-mobile" : undefined}
            className="ml-1 flex h-auto w-auto flex-col gap-1.5 p-2 lg:hidden"
          >
            <span className={`${BAR} ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`${BAR} ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`${BAR} ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </Button>
        </div>
      </nav>

      {/* Menu mobile */}
      {mobileOpen && (
        <ul
          id="menu-mobile"
          className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-svarati-teal/20 bg-white p-2 shadow-xl lg:hidden"
        >
          {MENU_UTAMA.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              pathname={pathname}
              isOpen={openPillarId === item.id}
              onToggle={() => togglePillar(item.id)}
              onNavigate={closeMobile}
            />
          ))}
        </ul>
      )}
      </header>

      <EmergencyModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </>
  );
}