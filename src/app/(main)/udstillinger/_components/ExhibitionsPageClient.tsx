'use client';

import { useState } from 'react';
import type { ExhibitionGalleryImage, ExhibitionPartner } from '@/lib/page-content-service';
import Image from 'next/image';
import { Mail, Phone, MapPin, Link as LinkIcon, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoPlayerModal } from './VideoPlayerModal';
import { Button } from '@/components/ui/button';

interface ExhibitionsPageClientProps {
    title: string;
    description: string;
    partners: ExhibitionPartner[];
    gallery_images: ExhibitionGalleryImage[];
    gallery_title: string;
}


export default function ExhibitionsPageClient({ title, description, partners, gallery_images, gallery_title }: ExhibitionsPageClientProps) {
    const [selectedVideo, setSelectedVideo] = useState<ExhibitionGalleryImage | null>(null);

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        try {
            return new Date(dateString).toLocaleDateString('da-DK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return null;
        }
    };

    const sortedGalleryImages = gallery_images
        ? [...gallery_images].sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
        : [];

    return (
        <div className="container max-w-7xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                    {title}
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80">
                    {description}
                </p>
            </div>

            {/* Faste Samarbejdspartnere */}
            <section className="mb-16">
                <h2 className="text-3xl font-headline text-center text-primary mb-8">Faste Samarbejdspartnere</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {partners.map((partner, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader className="flex-shrink-0">
                                {partner.image_url && (
                                    <div className="relative aspect-video w-full overflow-hidden mb-4">
                                        <Image
                                            src={partner.image_url}
                                            alt={partner.name}
                                            fill
                                            unoptimized={true}
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                )}
                                <CardTitle className="font-headline text-2xl text-primary">{partner.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-grow space-y-4">
                                <p className="text-muted-foreground flex-grow">{partner.description}</p>
                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Adresse</h4>
                                            <p className="text-sm">{partner.address}</p>
                                        </div>
                                    </div>
                                    {partner.website && (
                                    <div className="flex items-start gap-3">
                                        <LinkIcon className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Hjemmeside</h4>
                                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">{partner.website}</a>
                                        </div>
                                    </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Email</h4>
                                            <a href={`mailto:${partner.email}`} className="text-sm hoverunderline">{partner.email}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Telefon</h4>
                                            <a href={`tel:${partner.phone.replace(/\s/g, '')}`} className="text-sm hover:underline">{partner.phone}</a>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                              {partner.website && (
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <a href={partner.website} target="_blank" rel="noopener noreferrer">Besøg Hjemmeside</a>
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            </section>

            {/* Billedgalleri */}
            <section>
                <h2 className="text-3xl font-headline text-center text-primary mb-8">{gallery_title}</h2>
                {sortedGalleryImages && sortedGalleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sortedGalleryImages.map((item, index) => {
                             const isVideo = item.url.endsWith('.mp4');
                             return (
                                <Card key={index} className="group overflow-hidden flex flex-col">
                                    <CardContent className="p-0">
                                        <div 
                                            className="relative w-full aspect-square bg-card"
                                            onClick={() => isVideo && setSelectedVideo(item)}
                                        >
                                            {isVideo ? (
                                                <>
                                                    <video
                                                        src={item.url}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                        playsInline
                                                        loop
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer transition-opacity opacity-0 group-hover:opacity-100">
                                                        <PlayCircle className="w-16 h-16 text-white/80" />
                                                    </div>
                                                </>
                                            ) : (
                                                <Image
                                                    src={item.url}
                                                    alt={item.caption || `Udstillingsbillede ${index + 1}`}
                                                    fill
                                                    unoptimized={true}
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                />
                                            )}
                                        </div>
                                    </CardContent>
                                    {(item.caption || item.date) && (
                                        <CardFooter className="p-3 text-sm text-muted-foreground flex-col items-start flex-grow justify-end">
                                            {item.caption && <p className="font-medium text-foreground/90">{item.caption}</p>}
                                            {item.date && <p>{formatDate(item.date)}</p>}
                                        </CardFooter>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">Der er endnu ingen billeder i galleriet.</p>
                )}
            </section>
            
            {selectedVideo && (
                <VideoPlayerModal 
                    isOpen={!!selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    videoUrl={selectedVideo.url}
                    videoCaption={selectedVideo.caption}
                />
            )}
        </div>
    );
}
