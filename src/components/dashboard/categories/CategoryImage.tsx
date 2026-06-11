'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface CategoryImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { width: 32, height: 32, className: 'h-8 w-8' },
  md: { width: 56, height: 56, className: 'h-14 w-14' },
  lg: { width: 200, height: 200, className: 'h-48 w-48' },
};

export function CategoryImage({ src, alt, size = 'md' }: CategoryImageProps) {
  const config = sizeMap[size];

  if (!src) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-muted ${config.className}`}>
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${config.className}`}>
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
