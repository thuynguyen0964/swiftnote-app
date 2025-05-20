
"use client";

import { useState, useMemo } from "react";
import { useNotesContext } from "@/hooks/useNotesContext";
import type { Note } from "@/lib/types";
import { Header } from "@/components/Header";
import { NoteCard } from "@/components/NoteCard";
import { NoteEditor } from "@/components/NoteEditor";
import { NoteActionsToolbar } from "@/components/NoteActionsToolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileTextIcon } from "lucide-react"; // Renamed FileText to FileTextIcon

export default function HomePage() {
  const { notes, searchTerm, selectedNoteIds, toggleNoteSelection, isLoading } = useNotesContext();
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const handleOpenNewNoteEditor = () => {
    setEditingNote(undefined);
    setIsNoteEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsNoteEditorOpen(true);
  };

  const filteredAndSortedNotes = useMemo(() => {
    if (isLoading) return [];
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, searchTerm, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header onOpenNoteEditor={() => {}} />
        <main className="flex-grow container mx-auto px-4 py-6">
           <div className="h-[68px] mb-4">
             <Skeleton className="w-full h-full rounded-lg" />
           </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-56 rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onOpenNoteEditor={handleOpenNewNoteEditor} />
      <main className="flex-grow container mx-auto px-4 py-6">
        <NoteActionsToolbar />
        {filteredAndSortedNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAndSortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                isSelected={selectedNoteIds.includes(note.id)}
                onToggleSelect={toggleNoteSelection}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center text-center py-12">
            {notes.length > 0 && searchTerm ? ( // Only show search-specific message if there are notes to search through
              <>
                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold text-foreground">No Notes Found</h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Your search for "{searchTerm}" did not match any notes. Try a different keyword or clear the search.
                </p>
              </>
            ) : (
               <>
                <FileTextIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold text-foreground">No Notes Yet</h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  It looks like your notebook is empty. Click the "Create Note" button to add your first thought!
                </p>
              </>
            )}
          </div>
        )}
      </main>
      <NoteEditor
        isOpen={isNoteEditorOpen}
        onOpenChange={setIsNoteEditorOpen}
        note={editingNote}
      />
    </div>
  );
}

    