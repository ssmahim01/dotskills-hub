'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { width: 32, height: 32, className: 'h-8 w-8' },
  md: { width: 56, height: 56, className: 'h-14 w-14' },
  lg: { width: 200, height: 200, className: 'h-48 w-48' },
};

export function ProductImageGallery({ images, productName, size = 'md' }: ProductImageGalleryProps) {
  const config = sizeMap[size];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex];

  if (!mainImage) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-muted ${config.className}`}>
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className={`relative rounded-lg overflow-hidden ${config.className}`}>
        <Image src={mainImage} alt={productName} fill className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-10 w-10 rounded border-2 transition-colors ${
                index === selectedIndex
                  ? 'border-primary'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <Image src={image} alt={`${productName} ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
