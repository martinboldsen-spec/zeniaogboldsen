import { getArtworkById } from '@/lib/artwork-service';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArtworkPageClient } from './_components/ArtworkPageClient';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { artwork } = await getArtworkById(params.id);

  if (!artwork) {
    return {
      title: 'Kunstværk ikke fundet',
    };
  }

  return {
    title: artwork.name,
    description: artwork.description?.substring(0, 160) || `Se detaljer om kunstværket ${artwork.name}.`,
    openGraph: {
        images: [artwork.images[0]?.url || ''],
    }
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { artwork } = await getArtworkById(params.id);

  if (!artwork) {
    notFound();
  }
  
  return <ArtworkPageClient artwork={artwork} />;
}
