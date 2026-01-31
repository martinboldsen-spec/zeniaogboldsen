"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import type { HomePageContent } from "@/lib/page-content-service";
import { updateHomePageAction } from "@/app/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gemmer...</> : 'Gem Indhold'}
    </Button>
  );
}

export function EditHomeForm({ content }: { content: HomePageContent }) {
  const [updateState, formAction] = useFormState(updateHomePageAction, { message: null, errors: {} });

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Forsideindhold</CardTitle>
          <CardDescription>Rediger felterne for forsiden. Ændringerne vil blive vist med det samme.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="border-b pb-6">
             <h3 className="text-lg font-medium mb-4">Hero Sektion</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="home_hero_title">Hero Titel</Label>
                    <Input id="home_hero_title" name="home_hero_title" defaultValue={content.home_hero_title} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="home_hero_subtitle">Hero Undertitel</Label>
                    <Input id="home_hero_subtitle" name="home_hero_subtitle" defaultValue={content.home_hero_subtitle} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home_hero_image_url">Hero Billede URL</Label>
                  <Input id="home_hero_image_url" name="home_hero_image_url" defaultValue={content.home_hero_image_url} />
                  <p className="text-sm text-muted-foreground">Det store billede i toppen af siden.</p>
                </div>
            </div>
          </div>

          <div className="space-y-6 border-b pb-6">
              <h3 className="text-lg font-medium">Promo Karrusel</h3>
              <div className="flex items-center space-x-2">
                    <Switch 
                        id="promo_carousel_active" 
                        name="promo_carousel_active" 
                        defaultChecked={content.promo_carousel_active}
                    />
                    <Label htmlFor="promo_carousel_active">Vis promo karrusel på forsiden</Label>
                </div>
                {Array.from({ length: 4 }).map((_, index) => {
                    const slide = content.promo_carousel_slides?.[index];
                    return (
                        <div key={index} className="p-4 border rounded-md space-y-4">
                            <h4 className="text-md font-semibold">Slide #{index + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`slide_title_${index}`} className="text-xs">Titel</Label>
                                    <Input id={`slide_title_${index}`} name={`promo_carousel_slides.${index}.title`} defaultValue={slide?.title} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`slide_button_text_${index}`} className="text-xs">Knap Tekst</Label>
                                    <Input id={`slide_button_text_${index}`} name={`promo_carousel_slides.${index}.button_text`} defaultValue={slide?.button_text} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`slide_desc_${index}`} className="text-xs">Beskrivelse</Label>
                                <Textarea id={`slide_desc_${index}`} name={`promo_carousel_slides.${index}.description`} defaultValue={slide?.description} rows={2} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor={`slide_media_url_${index}`} className="text-xs">Medie URL (billede/video)</Label>
                                    <Input id={`slide_media_url_${index}`} name={`promo_carousel_slides.${index}.media_url`} defaultValue={slide?.media_url} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`slide_media_type_${index}`} className="text-xs">Medietype</Label>
                                    <Select name={`promo_carousel_slides.${index}.media_type`} defaultValue={slide?.media_type}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Vælg type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="image">Billede</SelectItem>
                                            <SelectItem value="video">Video</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor={`slide_button_link_${index}`} className="text-xs">Knap Link</Label>
                                <Input id={`slide_button_link_${index}`} name={`promo_carousel_slides.${index}.button_link`} defaultValue={slide?.button_link} placeholder="/galleri"/>
                            </div>
                        </div>
                    )
                })}
                <p className="text-sm text-muted-foreground">Efterlad titel-feltet tomt for at skjule et slide.</p>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-medium mb-4">Intro Sektion ("Rolig vildskab")</h3>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="home_intro_title">Titel</Label>
                    <Input id="home_intro_title" name="home_intro_title" defaultValue={content.home_intro_title} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="home_intro_content">Brødtekst</Label>
                    <Textarea id="home_intro_content" name="home_intro_content" defaultValue={content.home_intro_content} rows={8} />
                    <p className="text-sm text-muted-foreground">Brug linjeskift til at opdele i afsnit.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="home_intro_signature">Signatur</Label>
                    <Input id="home_intro_signature" name="home_intro_signature" defaultValue={content.home_intro_signature} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="home_intro_image_url">Billede URL</Label>
                    <Input id="home_intro_image_url" name="home_intro_image_url" defaultValue={content.home_intro_image_url} />
                     <p className="text-sm text-muted-foreground">Billedet ved siden af intro-teksten.</p>
                </div>
            </div>
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
