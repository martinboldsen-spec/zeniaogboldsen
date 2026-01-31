import { getArtPrintById } from '@/lib/art-print-service';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArtPrintClientPage } from './_components/ArtPrintClientPage';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artPrint = getArtPrintById(params.id);

  if (!artPrint) {
    return {
      title: 'Kunsttryk ikke fundet',
    };
  }

  // Find a suitable image for Open Graph, prioritizing the 'plain' frame or the first gallery image.
  const ogImage = artPrint.frameOptions.find(f => f.id === 'plain')?.url || artPrint.galleryImages[0]?.url || '';

  return {
    title: artPrint.name,
    description: artPrint.description,
    openGraph: {
        images: [ogImage],
    }
  };
}


export default function ArtPrintPage({ params }: Props) {
  const artPrint = getArtPrintById(params.id);

  if (!artPrint) {
    notFound();
  }

  return <ArtPrintClientPage artPrint={artPrint} />;
}
