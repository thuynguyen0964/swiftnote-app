
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNotesContext } from "@/hooks/useNotesContext";
import type { Note } from "@/lib/types";
import { DEFAULT_NOTE_COLOR } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "./ColorPicker";
import { TagInput } from "./TagInput";
import { useToast } from "@/hooks/use-toast";
import { Save, X } from "lucide-react";

interface NoteEditorProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  note?: Note; 
}

const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  content: z.string().max(5000, "Content cannot exceed 5000 characters").optional(),
});

type NoteFormSchema = z.infer<typeof noteSchema>;

interface NoteFormData extends NoteFormSchema {
 tags: string[];
 color: string;
}


export function NoteEditor({ isOpen, onOpenChange, note }: NoteEditorProps) {
  const { addNote, updateNote } = useNotesContext();
  const { toast } = useToast();
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const initialValues = useMemo<NoteFormData>(() => ({
    title: note?.title || "",
    content: note?.content || "",
    tags: note?.tags || [],
    color: note?.color || DEFAULT_NOTE_COLOR,
  }), [note]);

  const { control, handleSubmit, reset, formState: { errors, isDirty: formIsDirty, dirtyFields }, watch, setValue } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema), // Use schema without tags/color for RHF validation
    defaultValues: initialValues,
  });
  
  const currentTags = watch("tags");
  const currentColor = watch("color");

  const isFormActuallyDirty = useMemo(() => {
     if (formIsDirty) return true;
     if (JSON.stringify(currentTags) !== JSON.stringify(initialValues.tags)) return true;
     if (currentColor !== initialValues.color) return true;
     return false;
  }, [formIsDirty, currentTags, currentColor, initialValues]);


  useEffect(() => {
    reset(initialValues);
  }, [note, isOpen, reset, initialValues]);

  const onSubmit = (data: NoteFormSchema) => { // RHF data based on schema
    const noteDataToSave: Pick<Note, "title" | "content" | "tags" | "color"> = {
      title: data.title,
      content: data.content || "",
      tags: currentTags, // Use watched value
      color: currentColor, // Use watched value
    };

    if (note) {
      updateNote(note.id, noteDataToSave);
      toast({ title: "Note Updated", description: "Your note has been successfully updated." });
    } else {
      addNote(noteDataToSave);
      toast({ title: "Note Created", description: "Your new note has been successfully created." });
    }
    onOpenChange(false);
  };

  const handleCloseAttempt = () => {
    if (isFormActuallyDirty) {
      setShowUnsavedDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const confirmClose = () => {
    setShowUnsavedDialog(false);
    onOpenChange(false);
    reset(initialValues);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) handleCloseAttempt(); else onOpenChange(true);
      }}>
        <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground" onInteractOutside={handleCloseAttempt}>
          <DialogHeader>
            <DialogTitle>{note ? "Edit Note" : "Create New Note"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div>
              <Label htmlFor="title" className="font-medium">Title</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input id="title" {...field} placeholder="Note title" />}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="content" className="font-medium">Content</Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Textarea id="content" {...field} placeholder="Write your note here..." rows={8} />
                )}
              />
              {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="tags-input" className="font-medium">Tags</Label>
               <TagInput id="tags-input" tags={currentTags} onTagsChange={(newTags) => setValue("tags", newTags, { shouldDirty: true })} />
            </div>

            <div>
              <Label className="font-medium">Color</Label>
              <div className="mt-1">
                <ColorPicker selectedColor={currentColor} onColorSelect={(newColor) => setValue("color", newColor, { shouldDirty: true })} />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleCloseAttempt}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isFormActuallyDirty && !note?.id }> {/* Allow new empty note save */}
                <Save className="mr-2 h-4 w-4" /> {note ? "Save Changes" : "Create Note"}
              </Button>
            </DialogFooter>
          </form>
          <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={handleCloseAttempt} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} variant="destructive">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    