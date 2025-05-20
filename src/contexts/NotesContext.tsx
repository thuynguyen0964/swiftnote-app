
"use client";

import type { Note } from "@/lib/types";
import { LOCAL_STORAGE_NOTES_KEY, DEFAULT_NOTE_COLOR } from "@/lib/constants";
import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

interface NotesContextType {
  notes: Note[];
  selectedNoteIds: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addNote: (noteData: Pick<Note, "title" | "content" | "tags" | "color">) => Note;
  updateNote: (noteId: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => void;
  deleteNote: (noteId: string) => void;
  deleteSelectedNotes: () => void;
  togglePin: (noteId: string) => void;
  toggleBookmark: (noteId: string) => void;
  setNoteColor: (noteId: string, color: string) => void;
  addTagToNote: (noteId: string, tagName: string) => void;
  removeTagFromNote: (noteId: string, tagName: string) => void;
  toggleNoteSelection: (noteId: string) => void;
  clearSelection: () => void;
  selectAllNotes: () => void;
  getNoteById: (noteId: string) => Note | undefined;
  isLoading: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const initialNotesData: Note[] = [
  {
    id: "1",
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Cheese",
    tags: ["shopping", "food"],
    isPinned: true,
    isBookmarked: false,
    color: "#FFF9C4",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Meeting Notes",
    content: "Discuss Q3 roadmap. Project Alpha updates.",
    tags: ["work", "meeting"],
    isPinned: false,
    isBookmarked: true,
    color: "#BBDEFB",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Book Ideas",
    content: "A sci-fi novel about time-traveling librarians.",
    tags: ["creative", "writing"],
    isPinned: false,
    isBookmarked: false,
    color: DEFAULT_NOTE_COLOR,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];


export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes(initialNotesData);
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage:", error);
      setNotes(initialNotesData); 
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error("Failed to save notes to localStorage:", error);
      }
    }
  }, [notes, isLoading]);

  const addNote = useCallback((noteData: Pick<Note, "title" | "content" | "tags" | "color">): Note => {
    const newNote: Note = {
      ...noteData,
      id: uuidv4(),
      isPinned: false,
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: noteData.color || DEFAULT_NOTE_COLOR,
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    return newNote;
  }, []);

  const updateNote = useCallback((noteId: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
      )
    );
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    setSelectedNoteIds((prev) => prev.filter(id => id !== noteId));
  }, []);

  const deleteSelectedNotes = useCallback(() => {
    setNotes((prevNotes) => prevNotes.filter((note) => !selectedNoteIds.includes(note.id)));
    setSelectedNoteIds([]);
  }, [selectedNoteIds]);

  const togglePin = useCallback((noteId: string) => {
    const noteToUpdate = notes.find(n => n.id === noteId);
    if (noteToUpdate) {
      updateNote(noteId, { isPinned: !noteToUpdate.isPinned });
    }
  }, [notes, updateNote]);

  const toggleBookmark = useCallback((noteId: string) => {
     const noteToUpdate = notes.find(n => n.id === noteId);
    if (noteToUpdate) {
      updateNote(noteId, { isBookmarked: !noteToUpdate.isBookmarked });
    }
  }, [notes, updateNote]);

  const setNoteColor = useCallback((noteId: string, color: string) => {
    updateNote(noteId, { color });
  }, [updateNote]);

  const addTagToNote = useCallback((noteId: string, tagName: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note && !note.tags.includes(tagName.trim()) && tagName.trim() !== "") {
      updateNote(noteId, { tags: [...note.tags, tagName.trim()] });
    }
  }, [notes, updateNote]);

  const removeTagFromNote = useCallback((noteId: string, tagName: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      updateNote(noteId, { tags: note.tags.filter(t => t !== tagName) });
    }
  }, [notes, updateNote]);

  const toggleNoteSelection = useCallback((noteId: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNoteIds([]);
  }, []);

  const selectAllNotes = useCallback(() => {
    setSelectedNoteIds(notes.map(note => note.id));
  }, [notes]);

  const getNoteById = useCallback((noteId: string) => {
    return notes.find(note => note.id === noteId);
  }, [notes]);

  const contextValue = useMemo(() => ({
    notes,
    selectedNoteIds,
    searchTerm,
    setSearchTerm,
    addNote,
    updateNote,
    deleteNote,
    deleteSelectedNotes,
    togglePin,
    toggleBookmark,
    setNoteColor,
    addTagToNote,
    removeTagFromNote,
    toggleNoteSelection,
    clearSelection,
    selectAllNotes,
    getNoteById,
    isLoading,
  }), [
    notes, selectedNoteIds, searchTerm, setSearchTerm, addNote, updateNote, deleteNote,
    deleteSelectedNotes, togglePin, toggleBookmark, setNoteColor, addTagToNote,
    removeTagFromNote, toggleNoteSelection, clearSelection, selectAllNotes, getNoteById, isLoading
  ]);

  return <NotesContext.Provider value={contextValue}>{children}</NotesContext.Provider>;
};

export default NotesContext;

    