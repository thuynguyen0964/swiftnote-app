
"use client";

import { NotesProvider } from "@/contexts/NotesContext";
import { Toaster } from "@/components/ui/toaster";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NotesProvider>
      {children}
      <Toaster />
    </NotesProvider>
  );
}

    