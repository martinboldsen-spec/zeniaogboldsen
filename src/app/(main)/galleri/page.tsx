import { getAllArtworks } from '@/lib/artwork-service';
import { getPageContent } from '@/lib/page-content-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { ArtworkFilterGrid } from '../_components/ArtworkFilterGrid';
import { Suspense } from 'react';
import type { Metadata } from 'next';


export const revalidate = 86400; // Revalidate every 24 hours

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getPageContent();
  const title = content?.gallery?.title || 'Galleri';
  const description = content?.gallery?.description || 'Udforsk alle kunstværker af Martin Boldsen. Find unikke malerier, keramiske værker og meget mere.';

  return {
    title: title,
    description: description.substring(0, 160),
  }
};


export default async function GalleryPage() {
  const { artworks: allArtworks, error: artworksError } = await getAllArtworks();
  const { content, error: contentError } = await getPageContent();
  
  // Filter out secondary artworks for the main gallery
  const artworks = allArtworks?.filter(art => !art.isSecondary);

  const {
    title = 'Udforsk Kunsten',
    description = 'Velkommen til mit galleri. Her kan du dykke ned i mine seneste malerier, keramiske værker og unikke vægkunstinstallationer.'
  } = content?.gallery || {};

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
            <p className="text-muted-foreground">Der er i øjeblikket ingen værker i dette galleri.</p>
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
