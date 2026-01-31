'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Artwork, ArtworkImage, ArtworkVideo } from '@/lib/artwork-service';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { ArrowLeft, ArrowRight, PlayCircle, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShareButton } from './ShareButton';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type MediaItem = (ArtworkImage & { type: 'image' }) | (ArtworkVideo & { type: 'video' });

export function ArtworkPageClient({ artwork }: { artwork: Artwork }) {
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const media: MediaItem[] = [
    ...artwork.images.map(img => ({ type: 'image' as const, ...img })),
    ...(artwork.videos || []).map(vid => ({ type: 'video' as const, ...vid }))
  ];

  useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };
  
  const handleMainImageClick = () => {
    const currentMedia = media[current];
    if (currentMedia.type === 'image') {
        setSelectedMedia(currentMedia);
        setLightboxOpen(true);
    }
  };

  const hasDiscount = typeof artwork.discount === 'number' && artwork.discount > 0 && artwork.status === 'available';
  const discountedPrice = hasDiscount
    ? artwork.price * (1 - artwork.discount! / 100)
    : artwork.price;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const artworkSubject = `${artwork.name} (${formatPrice(discountedPrice)})`;
  
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
       <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbage
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
            <Carousel setApi={setApi} className="w-full overflow-hidden shadow-sm">
                <CarouselContent>
                    {media.map((item, index) => (
                    <CarouselItem key={index}>
                        <div 
                          className={cn(
                            "aspect-[4/5] relative group", 
                            item.type === 'image' && 'cursor-pointer',
                            item.type === 'video' && "bg-black cursor-default"
                          )}
                          onClick={item.type === 'image' ? handleMainImageClick : undefined}
                        >
                        {item.type === 'image' ? (
                            <>
                                <Image
                                    src={item.url}
                                    alt={`${artwork.name} - medie ${index + 1}`}
                                    fill
                                    unoptimized={true}
                                    priority={index === 0}
                                    className="object-contain"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    data-ai-hint={(item as any).dataAiHint || 'artwork image'}
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <ZoomIn className="w-12 h-12 text-white/80" />
                                </div>
                            </>
                        ) : (
                            <>
                                <video
                                    src={item.url}
                                    controls
                                    className="w-full h-full object-contain"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </>
                        )}
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                 {media.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-4 hidden sm:inline-flex" />
                        <CarouselNext className="absolute right-4 hidden sm:inline-flex" />
                    </>
                )}
            </Carousel>
            {media.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                    {media.map((item, index) => {
                        const thumbnailUrl = item.type === 'video' ? item.thumbnailUrl : item.url;
                        const showFallback = item.type === 'video' && !item.thumbnailUrl;

                        return (
                            <button
                                key={index}
                                onClick={() => handleThumbnailClick(index)}
                                className={cn(
                                    "relative aspect-[4/5] overflow-hidden transition-all bg-muted",
                                    index === current ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
                                )}
                            >
                                {thumbnailUrl && !showFallback ? (
                                    <Image
                                        src={thumbnailUrl}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        unoptimized={true}
                                        className="object-cover"
                                        sizes="20vw"
                                    />
                                ) : (
                                  <div className="w-full h-full bg-secondary"></div>
                                )}
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <PlayCircle className="w-6 h-6 text-white/80" />
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <div>
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">{artwork.name}</h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Oprettet: {new Date(artwork.creationDate).toLocaleDateString('da-DK', { year: 'numeric', month: 'long' })}
                </p>
                 <div className="mt-4 flex items-center gap-2">
                    {artwork.status === 'sold' && (
                        <Badge variant="secondary" className="text-base">Solgt</Badge>
                    )}
                    {artwork.atGallery && artwork.status !== 'sold' && (
                        <Badge className="bg-accent/80 text-accent-foreground border-accent/90 text-base">
                            På galleri
                        </Badge>
                    )}
                     {hasDiscount && (
                        <Badge variant="destructive" className="text-base">
                           -{artwork.discount}%
                        </Badge>
                    )}
                </div>
            </div>
            <ShareButton artworkName={artwork.name} />
          </div>

          <div className="mt-6 space-y-4 text-foreground/90">
             <p className="text-lg leading-relaxed">{artwork.description}</p>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold font-headline mb-4">Detaljer</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
                {artwork.dimensions && <p><strong>Dimensioner:</strong> {artwork.dimensions}</p>}
                {artwork.materials && <p><strong>Materialer:</strong> {artwork.materials}</p>}
                {artwork.weight && <p><strong>Vægt:</strong> {artwork.weight} kg</p>}
                <p><strong>Status:</strong> {artwork.status === 'sold' ? 'Solgt' : 'Tilgængelig'}</p>
            </div>
          </div>
          
          <div className="mt-auto pt-8">
            {artwork.status === 'available' ? (
                <div className="bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div>
                        <p className="text-sm text-primary">{hasDiscount ? 'Tilbudspris' : 'Pris'}</p>
                         {hasDiscount ? (
                            <div className="flex items-baseline gap-x-3">
                                <p className="text-3xl font-bold text-destructive">{formatPrice(discountedPrice)}</p>
                                <p className="text-xl font-medium text-muted-foreground line-through">{formatPrice(artwork.price)}</p>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-primary">{formatPrice(artwork.price)}</p>
                        )}
                    </div>
                    <Button asChild size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href={`/contact?artwork=${encodeURIComponent(artworkSubject)}`}>
                            Forespørg på værket
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="bg-secondary p-6 text-center">
                    <p className="text-xl font-semibold text-muted-foreground">Dette værk er solgt</p>
                     <Button asChild variant="outline" className="mt-4">
                        <Link href="/galleri">Se andre værker</Link>
                    </Button>
                </div>
            )}
          </div>
        </div>
      </div>
      
       {lightboxOpen && selectedMedia?.type === 'image' && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none">
            <div className="relative h-[90vh] w-full">
              <Image
                src={selectedMedia.url}
                alt={artwork.name}
                fill
                unoptimized={true}
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
