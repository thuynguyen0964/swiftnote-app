
"use client";

import { NOTE_COLORS } from "@/lib/constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorSelect }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change note color" className="h-8 w-8">
          <Palette
            className="h-4 w-4"
            style={{ color: selectedColor === "var(--card-bg-default)" ? "hsl(var(--foreground))" : selectedColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-3 gap-2">
          {NOTE_COLORS.map((color) => (
            <Button
              key={color.name}
              variant="outline"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full border-2",
                color.value === selectedColor ? "border-primary ring-2 ring-ring" : "border-muted"
              )}
              style={{ backgroundColor: color.value === "var(--card-bg-default)" ? "hsl(var(--card))" : color.value }}
              onClick={() => onColorSelect(color.value)}
              aria-label={`Select ${color.name} color`}
            >
              {color.value === selectedColor && <span className="sr-only">Selected</span>}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

    