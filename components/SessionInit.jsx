"use client";

import { useEffect } from "react";
import { ensureAnonymousSession } from "@/lib/session";

export default function SessionInit() {
  useEffect(() => {
    ensureAnonymousSession();
  }, []);

  return null;
}