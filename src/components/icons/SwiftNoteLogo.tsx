
import type { SVGProps } from 'react';

export function SwiftNoteLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
      <path
        d="M11.56 23.5H9L13.66 16L9 8.5H11.56L16.22 16L11.56 23.5Z"
        fill="hsl(var(--primary-foreground))"
      />
      <path
        d="M18 23.5V8.5H24.5V10.5H20V15H23.5V17H20V21.5H24.5V23.5H18Z"
        fill="hsl(var(--primary-foreground))"
      />
    </svg>
  );
}

    