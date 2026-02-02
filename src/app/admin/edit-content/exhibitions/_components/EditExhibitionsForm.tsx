"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { ExhibitionsPageContent } from "@/lib/page-content-service";
import { updateExhibitionsPageAction } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gemmer...</> : 'Gem Indhold'}
    </Button>
  );
}

export function EditExhibitionsForm({ content }: { content: ExhibitionsPageContent }) {
  const [updateState, formAction] = useFormState(updateExhibitionsPageAction, { message: null, errors: {} });

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Sideindhold: Udstillinger</CardTitle>
          <CardDescription>Rediger informationen vist på "Udstillinger" siden.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-4 border-b pb-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Sidetitel</Label>
                    <Input id="title" name="title" defaultValue={content.title} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description">Sidebeskrivelse</Label>
                    <Textarea id="description" name="description" defaultValue={content.description} rows={3} />
                </div>
            </div>

            <div className="space-y-6 border-b pb-6">
                <h3 className="text-lg font-medium">Faste Samarbejdspartnere</h3>
                 {Array.from({ length: 4 }).map((_, index) => {
                    const partner = content.partners?.[index];
                    return (
                        <div key={index} className="p-4 border rounded-md space-y-4">
                             <h4 className="text-md font-semibold">Partner #{index + 1}</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`partner_name_${index}`} className="text-xs">Navn</Label>
                                    <Input id={`partner_name_${index}`} name={`partners.${index}.name`} defaultValue={partner?.name} placeholder="Gallerinavn"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`partner_image_${index}`} className="text-xs">Billede URL</Label>
                                    <Input id={`partner_image_${index}`} name={`partners.${index}.image_url`} defaultValue={partner?.image_url} placeholder="https://..."/>
                                </div>
                             </div>
                              <div className="space-y-2">
                                <Label htmlFor={`partner_website_${index}`} className="text-xs">Hjemmeside URL</Label>
                                <Input id={`partner_website_${index}`} name={`partners.${index}.website`} defaultValue={partner?.website} placeholder="https://..."/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor={`partner_desc_${index}`} className="text-xs">Beskrivelse</Label>
                                <Textarea id={`partner_desc_${index}`} name={`partners.${index}.description`} defaultValue={partner?.description} rows={2} placeholder="Kort beskrivelse af galleriet"/>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`partner_address_${index}`} className="text-xs">Adresse</Label>
                                    <Input id={`partner_address_${index}`} name={`partners.${index}.address`} defaultValue={partner?.address}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`partner_email_${index}`} className="text-xs">Email</Label>
                                    <Input id={`partner_email_${index}`} name={`partners.${index}.email`} type="email" defaultValue={partner?.email}/>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`partner_phone_${index}`} className="text-xs">Telefon</Label>
                                    <Input id={`partner_phone_${index}`} name={`partners.${index}.phone`} defaultValue={partner?.phone}/>
                                </div>
                             </div>
                        </div>
                    )
                })}
                <p className="text-sm text-muted-foreground">Efterlad et felt tomt for at skjule en partner. Kun partnere med et udfyldt navn vil blive vist.</p>
            </div>
             <div className="space-y-6">
                <h3 className="text-lg font-medium">Galleri fra Udstillinger</h3>
                <div className="space-y-2 border-b pb-6">
                    <Label htmlFor="gallery_title">Galleri Overskrift</Label>
                    <Input id="gallery_title" name="gallery_title" defaultValue={content.gallery_title} />
                </div>
                {Array.from({ length: 12 }).map((_, index) => {
                    const image = content.gallery_images?.[index];
                    return (
                         <div key={index} className="p-4 border rounded-md">
                            <h4 className="text-md font-semibold mb-4">Medie #{index + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor={`image_url_${index}`} className="text-xs">Billede/Video URL</Label>
                                    <Input id={`image_url_${index}`} name={`gallery_images.${index}.url`} defaultValue={image?.url} placeholder="https://..."/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`image_date_${index}`} className="text-xs">Dato (YYYY-MM-DD)</Label>
                                    <Input id={`image_date_${index}`} name={`gallery_images.${index}.date`} defaultValue={image?.date} placeholder="F.eks. 2024-08-15"/>
                                </div>
                            </div>
                             <div className="space-y-2 mt-4">
                                <Label htmlFor={`image_caption_${index}`} className="text-xs">Billedetekst</Label>
                                <Input id={`image_caption_${index}`} name={`gallery_images.${index}.caption`} defaultValue={image?.caption} placeholder="Kort beskrivelse af billedet/videoen"/>
                            </div>
                        </div>
                    )
                })}
                 <p className="text-sm text-muted-foreground">Efterlad URL feltet tomt for at skjule et medie. Indsæt URL til billede eller video (.mp4).</p>
            </div>
          
          <div className="flex justify-end items-center gap-4 border-t pt-6">
              {updateState?.message && <p className="text-sm text-muted-foreground">{updateState.message}</p>}
              <SubmitButton />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
