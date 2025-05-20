
"use client";

import type { Note } from "@/lib/types";
import { useNotesContext } from "@/hooks/useNotesContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColorPicker } from "./ColorPicker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pin, PinOff, Bookmark as BookmarkIcon, Trash2, Edit3, MoreVertical, Star } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import React from "react";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  isSelected: boolean;
  onToggleSelect: (noteId: string) => void;
}

export function NoteCard({ note, onEdit, isSelected, onToggleSelect }: NoteCardProps) {
  const { deleteNote, togglePin, toggleBookmark, setNoteColor } = useNotesContext();

  const cardStyle = {
    backgroundColor: note.color !== "var(--card-bg-default)" ? note.color : undefined,
    '--card-bg-default': 'hsl(var(--card))'
  } as React.CSSProperties;

  // Basic contrast logic. For more robust solution, a color library (e.g., tinycolor2) would be needed.
  // This is a simplified heuristic.
  const isDarkBg = note.color !== "var(--card-bg-default)" && note.color.startsWith("#") && parseInt(note.color.substring(1,3), 16) * 0.299 + parseInt(note.color.substring(3,5), 16) * 0.587 + parseInt(note.color.substring(5,7), 16) * 0.114 < 186;
  const textColorClass = isDarkBg ? "text-white" : "text-card-foreground";
  const mutedTextColorClass = isDarkBg ? "text-gray-300" : "text-muted-foreground";
  const iconColorClass = isDarkBg ? "text-gray-200 hover:text-white" : "text-muted-foreground hover:text-foreground";
  const badgeVariant = isDarkBg ? "default" : "secondary";
  const badgeClassName = isDarkBg ? "bg-white/20 text-white border-white/30 hover:bg-white/30" : "";
  const checkboxClassName = isDarkBg ? "border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary" : "";


  const handleSetColor = (color: string) => {
    setNoteColor(note.id, color);
  };

  return (
    <Card className={cn("flex flex-col justify-between shadow-md rounded-lg overflow-hidden transition-all hover:shadow-lg", textColorClass)} style={cardStyle}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-shrink min-w-0">
             <Checkbox
                id={`select-${note.id}`}
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(note.id)}
                aria-label={`Select note ${note.title}`}
                className={cn("mt-1 flex-shrink-0", checkboxClassName)}
             />
            <CardTitle className={cn("text-lg font-semibold cursor-pointer hover:underline truncate", textColorClass)} onClick={() => onEdit(note)} title={note.title || "Untitled Note"}>
              {note.title || "Untitled Note"}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {note.isPinned && <Pin className={cn("h-4 w-4", isDarkBg ? "text-primary-foreground" : "text-primary")} />}
            {note.isBookmarked && <Star className={cn("h-4 w-4", isDarkBg ? "text-yellow-300 fill-yellow-300" : "text-yellow-500 fill-yellow-500")} />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4 flex-grow cursor-pointer" onClick={() => onEdit(note)}>
        <p className={cn("text-sm line-clamp-4 whitespace-pre-wrap", textColorClass)}>{note.content || "No content"}</p>
        {note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag) => ( // Show max 3 tags initially
              <Badge key={tag} variant={badgeVariant} className={cn("text-xs", badgeClassName)}>
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
                <Badge variant={badgeVariant} className={cn("text-xs", badgeClassName)}>+{note.tags.length-3}</Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className={cn("pt-2 pb-3 px-4 flex items-center justify-between text-xs", mutedTextColorClass)}>
        <span>
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
        <div className="flex items-center gap-0.5">
          <ColorPicker selectedColor={note.color} onColorSelect={handleSetColor} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("h-8 w-8", iconColorClass)}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => togglePin(note.id)}>
                {note.isPinned ? <PinOff className="mr-2 h-4 w-4" /> : <Pin className="mr-2 h-4 w-4" />}
                {note.isPinned ? "Unpin" : "Pin"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleBookmark(note.id)}>
                 {note.isBookmarked ? <BookmarkIcon className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                {note.isBookmarked ? "Unbookmark" : "Bookmark"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the note titled "{note.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteNote(note.id)} variant="destructive">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}

    