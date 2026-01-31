import type { ArtPrint } from '@/lib/art-print-service';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ArtPrintCardProps = {
  artPrint: ArtPrint;
};

export function ArtPrintCard({ artPrint }: ArtPrintCardProps) {
  // Use the image with the black frame as the default for the card
  const displayImage = artPrint.frameOptions.find(img => img.id === 'black_frame') || artPrint.frameOptions.find(img => img.id === 'plain') || artPrint.galleryImages?.[0];
  
  // Safely calculate starting price
  const startingPrice = artPrint.frameOptions && artPrint.frameOptions.length > 0 
    ? artPrint.frameOptions.reduce((min, p) => p.price < min ? p.price : min, artPrint.frameOptions[0].price)
    : 0;


  return (
    <Link href={`/kunsttryk/${artPrint.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-card">
            {displayImage && (
              <Image
                src={displayImage.url}
                alt={artPrint.name}
                fill
                unoptimized={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            )}
          </div>
          <div className="p-4 text-center">
            <h3 className="font-headline text-lg font-semibold truncate text-primary">{artPrint.name}</h3>
            {startingPrice > 0 ? (
                <p className="text-sm text-muted-foreground">fra {`${startingPrice.toLocaleString('da-DK')} DKK`}</p>
            ) : (
                <p className="text-sm text-muted-foreground">Pris efter aftale</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
