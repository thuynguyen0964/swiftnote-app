
"use client";

import NotesContext from "@/contexts/NotesContext";
import { useContext } from "react";

export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotesContext must be used within a NotesProvider");
  }
  return context;
};

    