"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ArtPrint } from "@/lib/art-print-service";
import { updateSingleArtPrintAction } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gemmer...</> : 'Gem Ændringer'}
    </Button>
  );
}

function ArtPrintEditForm({ artPrint, index }: { artPrint: ArtPrint, index: number }) {
    const { toast } = useToast();

    // The form action needs to be bound with the specific artPrint id
    const updateAction = updateSingleArtPrintAction.bind(null, artPrint.id);
    const [state, formAction] = useFormState(updateAction, { message: null, errors: {} });

    useEffect(() => {
        if (state?.message) {
            if (state.errors) {
                 toast({
                    title: "Fejl",
                    description: state.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Gemt!",
                    description: state.message,
                });
            }
        }
    }, [state, toast]);

    const plainOpt = artPrint.frameOptions.find(i => i.id === 'plain');
    const blackFrameOpt = artPrint.frameOptions.find(i => i.id === 'black_frame');
    const oakFrameOpt = artPrint.frameOptions.find(i => i.id === 'oak_frame');

    return (
        <form action={formAction}>
             <div className="space-y-6 p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`name-${artPrint.id}`}>Navn</Label>
                        <Input id={`name-${artPrint.id}`} name="name" defaultValue={artPrint.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`size-${artPrint.id}`}>Størrelse</Label>
                        <Input id={`size-${artPrint.id}`} name="size" defaultValue={artPrint.size} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`description-${artPrint.id}`}>Beskrivelse</Label>
                    <Textarea id={`description-${artPrint.id}`} name="description" defaultValue={artPrint.description} rows={4} />
                </div>

                 <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Rammemuligheder & Priser</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 p-4 border rounded-md">
                        <h5 className="md:col-span-2 text-md font-semibold">Uden Ramme</h5>
                        <div className="space-y-2">
                            <Label htmlFor={`plain_url-${artPrint.id}`} className="text-xs">Billede URL</Label>
                            <Input id={`plain_url-${artPrint.id}`} name="frameOptions.plain.url" defaultValue={plainOpt?.url} placeholder="https://..."/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`plain_price-${artPrint.id}`} className="text-xs">Pris (DKK)</Label>
                            <Input id={`plain_price-${artPrint.id}`} name="frameOptions.plain.price" type="number" defaultValue={plainOpt?.price} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 p-4 border rounded-md">
                        <h5 className="md:col-span-2 text-md font-semibold">Sort Træramme</h5>
                        <div className="space-y-2">
                            <Label htmlFor={`black_frame_url-${artPrint.id}`} className="text-xs">Billede URL</Label>
                            <Input id={`black_frame_url-${artPrint.id}`} name="frameOptions.black_frame.url" defaultValue={blackFrameOpt?.url} placeholder="https://..."/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`black_frame_price-${artPrint.id}`} className="text-xs">Pris (DKK)</Label>
                            <Input id={`black_frame_price-${artPrint.id}`} name="frameOptions.black_frame.price" type="number" defaultValue={blackFrameOpt?.price} />
                        </div>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 p-4 border rounded-md">
                        <h5 className="md:col-span-2 text-md font-semibold">Egetræsramme</h5>
                        <div className="space-y-2">
                            <Label htmlFor={`oak_frame_url-${artPrint.id}`} className="text-xs">Billede URL</Label>
                            <Input id={`oak_frame_url-${artPrint.id}`} name="frameOptions.oak_frame.url" defaultValue={oakFrameOpt?.url} placeholder="https://..."/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`oak_frame_price-${artPrint.id}`} className="text-xs">Pris (DKK)</Label>
                            <Input id={`oak_frame_price-${artPrint.id}`} name="frameOptions.oak_frame.price" type="number" defaultValue={oakFrameOpt?.price} />
                        </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Galleri Billeder (op til 3)</h4>
                    {Array.from({ length: 3 }).map((_, imgIndex) => (
                        <div key={imgIndex} className="space-y-2">
                            <Label htmlFor={`gallery_url_${imgIndex}-${artPrint.id}`} className="text-xs">URL - Galleri Billede #{imgIndex + 1}</Label>
                            <Input id={`gallery_url_${imgIndex}-${artPrint.id}`} name={`galleryImages[${imgIndex}].url`} defaultValue={artPrint.galleryImages?.[imgIndex]?.url} placeholder="https://..."/>
                        </div>
                    ))}
                    <p className="text-sm text-muted-foreground">Efterlad felter tomme for at fjerne et galleribillede.</p>
                 </div>
            </div>
            <div className="flex justify-end items-center gap-4 mt-6 border-t pt-6">
                <SubmitButton />
            </div>
        </form>
    );
}


export function EditArtPrintsForm({ artPrints }: { artPrints: ArtPrint[] }) {

  return (
        <Card>
            <CardHeader>
                <CardTitle>Rediger Kunsttryk</CardTitle>
                <CardDescription>Administrer informationen for alle kunsttryk her. Hvert kunsttryk gemmes individuelt.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {artPrints.map((print, index) => (
                        <AccordionItem value={`item-${index}`} key={print.id}>
                            <AccordionTrigger>
                                <span className="font-headline text-lg">{print.name || `Kunsttryk #${index + 1}`}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ArtPrintEditForm artPrint={print} index={index} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
  );
}
