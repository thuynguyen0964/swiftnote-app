
"use client";

import { useNotesContext } from "@/hooks/useNotesContext";
import { Button } from "@/components/ui/button";
import { Trash2, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


export function NoteActionsToolbar() {
  const { selectedNoteIds, notes, deleteSelectedNotes, clearSelection, selectAllNotes, isLoading } = useNotesContext();

  if (isLoading || selectedNoteIds.length === 0) {
    return <div className="h-[68px] mb-4"></div>; // Placeholder for height consistency
  }

  const allNotesCurrentlyDisplayed = notes.length > 0 && selectedNoteIds.length === notes.length; // This might need adjustment if notes are filtered

  const handleToggleSelectAll = () => {
    // This needs to consider currently filtered notes if pagination/virtualization is added.
    // For now, it selects/deselects all notes in the `notes` array from context.
    if (allNotesCurrentlyDisplayed) {
      clearSelection();
    } else {
      selectAllNotes();
    }
  };

  return (
    <div className="sticky top-[65px] md:top-0 z-10 bg-background/80 backdrop-blur-md p-3 mb-4 rounded-lg shadow border">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="select-all-toolbar"
            checked={allNotesCurrentlyDisplayed}
            onCheckedChange={handleToggleSelectAll}
            aria-label="Select all notes"
          />
          <Label htmlFor="select-all-toolbar" className="text-sm font-medium whitespace-nowrap">
            {selectedNoteIds.length} note{selectedNoteIds.length > 1 ? 's' : ''} selected
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearSelection} aria-label="Clear selection">
            <XCircle className="mr-1.5 h-4 w-4" />
            Clear
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" aria-label="Delete selected notes">
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete {selectedNoteIds.length} note{selectedNoteIds.length > 1 ? 's' : ''}. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteSelectedNotes} variant="destructive">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

    