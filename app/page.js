"use client";

import React, { useState } from 'react';
import ToggleSwitch from '@/components/ToggleSwitch';

export default function TestToggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <main className="min-h-screen bg-svarati-cream p-10 font-sans">
      <div className="mx-auto max-w-xl space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="border-b border-svarati-teal-soft pb-4 text-2xl font-bold text-svarati-teal">
          🔬 Lab QA: Toggle Switch (RLA012)
        </h1>

        {/* Test 1: Fungsi Normal */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-svarati-lavender-darker">1. Fungsi Normal</h2>
          <div className="flex items-center justify-between rounded-lg border border-svarati-lavender-light p-4">
            <span className="font-medium text-svarati-teal-dark">
              Status Switch: {isOn ? 'Menyala (ON)' : 'Mati (OFF)'}
            </span>
            <ToggleSwitch
              checked={isOn}
              onChange={setIsOn}
            />
          </div>
        </section>

        {/* Test 2: State Disabled */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-svarati-lavender-darker">2. State Disabled (Mati/Tidak Bisa Diklik)</h2>
          <div className="flex items-center gap-6 rounded-lg border border-svarati-lavender-light bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Disabled OFF:</span>
              <ToggleSwitch checked={false} disabled={true} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Disabled ON:</span>
              <ToggleSwitch checked={true} disabled={true} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}