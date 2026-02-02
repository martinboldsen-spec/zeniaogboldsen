"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { SeoPageContent } from "@/lib/page-content-service";
import { updateSeoPageAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gemmer...</> : 'Gem Indstillinger'}
    </Button>
  );
}

export function EditSeoForm({ content }: { content: SeoPageContent }) {
  const [updateState, formAction] = useFormState(updateSeoPageAction, { message: null, errors: {} });

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>SEO & Indstillinger</CardTitle>
          <CardDescription>Administrer globale SEO-indstillinger og sporings-scripts for din hjemmeside.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          <div className="space-y-6 border-b pb-6">
            <h3 className="text-lg font-medium">Global Meta Information</h3>
            <div className="space-y-2">
              <Label htmlFor="defaultTitle">Standard Sidetitel</Label>
              <Input id="defaultTitle" name="defaultTitle" defaultValue={content.defaultTitle} />
              <p className="text-sm text-muted-foreground">Titlen der vises i browserfanen på forsiden.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleTemplate">Skabelon for Sidetitler</Label>
              <Input id="titleTemplate" name="titleTemplate" defaultValue={content.titleTemplate} />
              <p className="text-sm text-muted-foreground">Bruges til at formatere titler på undersider. Brug '%s' som pladsholder for den specifikke sides titel (f.eks. "%s | Min Side").</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Standard Meta Beskrivelse</Label>
              <Textarea id="description" name="description" defaultValue={content.description} rows={3} />
              <p className="text-sm text-muted-foreground">En kort beskrivelse af din side til søgemaskiner (ca. 155-160 tegn).</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Meta Keywords</Label>
              <Input id="keywords" name="keywords" defaultValue={content.keywords?.join(', ')} />
              <p className="text-sm text-muted-foreground">En kommasepareret liste af nøgleord, der beskriver din side.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="ogImageUrl">Standard Billede til Social Deling</Label>
              <Input id="ogImageUrl" name="ogImageUrl" defaultValue={content.ogImageUrl} />
              <p className="text-sm text-muted-foreground">URL til et standardbillede (1200x630px anbefales), der bruges, når forsiden deles på sociale medier.</p>
            </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-lg font-medium">Tracking & Analytics</h3>
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input id="googleAnalyticsId" name="googleAnalyticsId" defaultValue={content.googleAnalyticsId} placeholder="G-XXXXXXXXXX" />
                <p className="text-sm text-muted-foreground">Indsæt dit "Measurement ID" fra Google Analytics 4.</p>
              </div>
               <div className="space-y-2">
                <Label htmlFor="headerScript">Header Script</Label>
                <Textarea id="headerScript" name="headerScript" defaultValue={content.headerScript} rows={8} placeholder="<script>...</script>" />
                <p className="text-sm text-muted-foreground">Indsæt her tracking scripts (f.eks. Meta Pixel, Hotjar) som skal placeres i sidens `&lt;head&gt;`.</p>
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
