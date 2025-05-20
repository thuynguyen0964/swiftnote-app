
"use client";

import { SwiftNoteLogo } from "@/components/icons/SwiftNoteLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotesContext } from "@/hooks/useNotesContext";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onOpenNoteEditor: () => void;
}

export function Header({ onOpenNoteEditor }: HeaderProps) {
  const { searchTerm, setSearchTerm } = useNotesContext();

  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <SwiftNoteLogo className="h-8 w-8" />
          <h1 className="text-xl sm:text-2xl font-bold text-primary hidden_ xs:block">SwiftNote</h1>
        </Link>
        
        <div className="flex-grow max-w-xs sm:max-w-sm md:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8 h-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search notes"
            />
          </div>
        </div>

        <Button onClick={onOpenNoteEditor} size="sm" className="shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create
          <span className="hidden sm:inline ml-1">Note</span>
        </Button>
      </div>
    </header>
  );
}

    