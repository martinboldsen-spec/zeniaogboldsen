'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ArtPrint, ArtPrintFrameOption } from '@/lib/art-print-service';
import { getArtPrintById } from '@/lib/art-print-service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { useCart, type CartItem } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';


export function ArtPrintClientPage({ artPrint }: { artPrint: ArtPrint }) {
  const [selectedFrame, setSelectedFrame] = useState<ArtPrintFrameOption>(artPrint.frameOptions[0]);
  const [activeGalleryImage, setActiveGalleryImage] = useState(artPrint.galleryImages[0] || artPrint.frameOptions[0]);
  
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    // We already have the full artPrint object from the page props.
    // No need to re-fetch.
    const itemToAdd: CartItem = {
      ...artPrint, // Pass the full object
      price: selectedFrame.price, // Use price from selected frame
      selectedFrame: selectedFrame.description
    };
    addItem(itemToAdd);
    toast({
        title: "Tilføjet til kurv",
        description: `"${artPrint.name}" (${selectedFrame.description}) er blevet tilføjet til din ønskeliste.`,
    });
  };

  const allImages = [...artPrint.galleryImages, ...artPrint.frameOptions.map(f => ({id: f.id, url: f.url, alt: f.description}))];

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
           <div className="relative aspect-[4/5] w-full overflow-hidden bg-card shadow-sm mb-4">
                <Image
                    key={activeGalleryImage.id}
                    src={activeGalleryImage.url}
                    alt={activeGalleryImage.alt}
                    fill
                    unoptimized={true}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover animate-in fade-in-25"
                />
            </div>
             <div className="grid grid-cols-5 gap-2">
                {allImages.map(image => (
                    <button 
                        key={image.id}
                        className={cn(
                            "relative aspect-[4/5] overflow-hidden transition-all",
                            activeGalleryImage.id === image.id ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
                        )}
                        onClick={() => setActiveGalleryImage(image)}
                    >
                         <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            unoptimized={true}
                            className="object-cover"
                            sizes="20vw"
                        />
                    </button>
                ))}
            </div>
        </div>

        {/* Details and Options */}
        <div className="flex flex-col">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">{artPrint.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">Kunsttryk, {artPrint.size}</p>
            
            <p className="text-3xl font-bold text-primary mt-6">{`${selectedFrame.price.toLocaleString('da-DK')} DKK`}</p>

             <div className="mt-8 prose prose-lg max-w-none text-foreground/90">
                <p>{artPrint.description}</p>
             </div>

            <div className="mt-8 pt-8 border-t">
                <h2 className="text-xl font-semibold font-headline mb-4">Vælg ramme</h2>
                <RadioGroup 
                    defaultValue={selectedFrame.id} 
                    onValueChange={(value) => {
                        const newFrame = artPrint.frameOptions.find(f => f.id === value);
                        if (newFrame) {
                          setSelectedFrame(newFrame);
                          const matchingImage = allImages.find(img => img.id === newFrame.id);
                          if(matchingImage) setActiveGalleryImage(matchingImage);
                        }
                    }}
                    className="space-y-3"
                >
                    {artPrint.frameOptions.map(frame => (
                         <Label 
                            key={frame.id} 
                            htmlFor={frame.id} 
                            className={cn(
                                "flex items-center justify-between gap-4 border p-4 cursor-pointer hover:border-primary transition-colors",
                                selectedFrame.id === frame.id && 'border-primary ring-1 ring-primary'
                            )}
                         >
                            <div className="flex items-center gap-4">
                                <RadioGroupItem value={frame.id} id={frame.id} />
                                <span>{frame.description}</span>
                            </div>
                            <span className="font-semibold">{frame.price.toLocaleString('da-DK')} DKK</span>
                        </Label>
                    ))}
                </RadioGroup>
            </div>
            
            <div className="mt-auto pt-8">
                <Button onClick={handleAddToCart} size="lg" className="w-full">
                    <CheckCircle className="mr-2 h-5 w-5"/>
                    Læg i kurv
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
