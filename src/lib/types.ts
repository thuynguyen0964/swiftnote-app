
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[]; // Array of tag names
  isPinned: boolean;
  isBookmarked: boolean;
  color: string; // Hex color string or CSS variable string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

    