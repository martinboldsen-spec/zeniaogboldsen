'use client';

import type { Artwork } from '@/lib/artwork-service';
import { ArtworkFilterGridClient } from './ArtworkFilterGridClient';

export function ArtworkFilterGrid({ artworks }: { artworks: Artwork[] }) {
  return <ArtworkFilterGridClient artworks={artworks} />;
}
