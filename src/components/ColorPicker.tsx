
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
  let paletteIconColor: string;

  if (selectedColor === "var(--card-bg-default)") {
    // Card background is default (likely white), icon uses foreground color (dark)
    paletteIconColor = "hsl(var(--foreground))";
  } else if (typeof selectedColor === 'string' && selectedColor.startsWith("#")) {
    // Selected color is a hex, and it's likely the background of the card.
    // Determine icon color based on brightness of selectedColor.
    const hex = selectedColor.replace("#", "");
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      // Simple brightness calculation (sum of RGB values)
      // A more accurate formula is (0.299*R + 0.587*G + 0.114*B)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      if (brightness > 128) { // If selectedColor is light
        paletteIconColor = "hsl(var(--foreground))"; // Use dark icon
      } else { // If selectedColor is dark
        paletteIconColor = "hsl(var(--primary-foreground))"; // Use light icon (white)
      }
    } else {
      // Fallback for invalid hex length
      paletteIconColor = "hsl(var(--foreground))";
    }
  } else {
    // Fallback for other color formats or unexpected values, default to foreground.
    // This ensures visibility on light backgrounds if selectedColor is not a parsable hex.
    paletteIconColor = "hsl(var(--foreground))";
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change note color" className="h-8 w-8">
          <Palette
            className="h-4 w-4"
            style={{ color: paletteIconColor }}
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
