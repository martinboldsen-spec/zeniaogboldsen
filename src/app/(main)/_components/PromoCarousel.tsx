'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay"

import type { PromoCarouselSlide } from '@/lib/page-content-service';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

export function PromoCarousel({ slides }: { slides: PromoCarouselSlide[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 7000, stopOnInteraction: true })
  )

  return (
    <Carousel 
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-video w-full overflow-hidden bg-secondary">
              {slide.media_type === 'video' ? (
                <video
                  src={slide.media_url}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={slide.media_url}
                  alt={slide.title}
                  fill
                  unoptimized={true}
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold font-headline drop-shadow-lg">
                  {slide.title}
                </h3>
                <p className="mt-2 max-w-2xl text-base text-white/90 drop-shadow-md">
                  {slide.description}
                </p>
                {slide.button_text && slide.button_link && (
                    <div className="mt-6">
                        <Button asChild size="lg" variant="secondary">
                            <Link href={slide.button_link}>
                                {slide.button_text}
                            </Link>
                        </Button>
                    </div>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 hidden md:inline-flex" />
      <CarouselNext className="absolute right-4 hidden md:inline-flex" />
    </Carousel>
  );
}
