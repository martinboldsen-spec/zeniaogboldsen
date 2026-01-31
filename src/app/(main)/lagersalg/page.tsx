import { getAllArtworks } from '@/lib/artwork-service';
import { getPageContent } from '@/lib/page-content-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { ArtworkFilterGrid } from '../_components/ArtworkFilterGrid';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';


export const revalidate = 86400; // Revalidate every 24 hours

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getPageContent();
  const title = content?.seo?.secondaryGalleryTitle || 'Lagersalg';
  const description = content?.seo?.secondaryGalleryDescription || `Udsalg og gode tilbud på udvalgte kunstværker af Martin Boldsen.`;

  return {
    title: title,
    description: description,
  }
};


export default async function LagersalgPage() {
  const { artworks: allArtworks, error: artworksError } = await getAllArtworks();
  const { content, error: contentError } = await getPageContent();

  if (!content?.seo?.secondaryGalleryActive) {
    redirect('/galleri');
  }

  // Filter for secondary artworks for the sale gallery
  const artworks = allArtworks?.filter(art => art.isSecondary);

  const {
    title = 'Lagersalg',
    description = 'Her finder du et udvalg af værker til nedsat pris. Det kan være ældre værker, prototyper eller værker fra udstillinger.'
  } = {
    title: content?.seo?.secondaryGalleryTitle,
    description: content?.seo?.secondaryGalleryDescription
  } || {};

  const error = artworksError || contentError;

  if (error && !artworks) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Der opstod en fejl</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!artworks || artworks.length === 0) {
    return (
        <div className="container py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80 mb-8">
              {description}
            </p>
            <p className="text-muted-foreground">Der er i øjeblikket ingen værker på lagersalg.</p>
        </div>
    )
  }

  return (
    <>
      <section className="container max-w-7xl mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          {description}
        </p>
      </section>

      <Suspense fallback={<div className="text-center py-12">Indlæser filter...</div>}>
        <ArtworkFilterGrid artworks={artworks} />
      </Suspense>

      {error && artworks && (
        <div className="container my-4">
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Advarsel</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
      )}
    </>
  );
}
