import type { Artwork } from '@/lib/artwork-service';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ArtworkCardProps = {
  artwork: Artwork;
};

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const primaryImage = artwork.images[artwork.primaryImageIndex] || artwork.images[0];

  const isSold = artwork.status === 'sold';
  const hasDiscount = !isSold && typeof artwork.discount === 'number' && artwork.discount > 0;

  const discountedPrice = hasDiscount
    ? artwork.price * (1 - artwork.discount! / 100)
    : artwork.price;

  return (
    <Link href={`/artwork/${artwork.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out shadow-none hover:shadow-xl hover:-translate-y-1 border-none">
        <CardContent className="p-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={artwork.name}
                fill
                unoptimized={true}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                data-ai-hint={primaryImage.dataAiHint || 'artwork image'}
              />
            )}
             {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/70">
                    <Badge variant="secondary" className="text-lg">
                    Solgt
                    </Badge>
                </div>
              )}
          </div>
          <div className="p-4 text-center">
            <h3 className="font-headline text-xl font-semibold truncate text-primary">{artwork.name}</h3>
            <p className="text-sm text-muted-foreground">{artwork.artist === 'boldsen' ? 'Martin Boldsen' : 'Anja Zenia'}</p>
            
            <div className="mt-3">
              {!isSold && (
                hasDiscount ? (
                  <div className="flex flex-wrap items-baseline justify-center gap-x-2">
                    <p className="text-md font-semibold text-destructive">
                      {`${discountedPrice.toLocaleString('da-DK')} DKK`}
                    </p>
                    <p className="text-sm text-muted-foreground line-through">
                      {`${artwork.price.toLocaleString('da-DK')} DKK`}
                    </p>
                  </div>
                ) : (
                  <p className="text-md font-semibold text-foreground">
                    {`${artwork.price.toLocaleString('da-DK')} DKK`}
                  </p>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
