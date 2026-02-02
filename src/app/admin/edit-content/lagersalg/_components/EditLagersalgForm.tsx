"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { SeoPageContent } from "@/lib/page-content-service";
import { updateLagersalgPageAction } from "@/lib/actions";
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

export function EditLagersalgForm({ content }: { content: SeoPageContent }) {
  const [updateState, formAction] = useFormState(updateLagersalgPageAction, { message: null, errors: {} });

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Lagersalg Indstillinger</CardTitle>
          <CardDescription>Administrer synlighed og tekster for lagersalg-siden.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

           <div className="space-y-6 border-b pb-6">
            <h3 className="text-lg font-medium">Generelt</h3>
            <div className="flex items-center space-x-2">
                <Switch 
                  id="secondaryGalleryActive" 
                  name="secondaryGalleryActive"
                  defaultChecked={content.secondaryGalleryActive}
                />
                <Label htmlFor="secondaryGalleryActive">Vis lagersalg-side i menuen</Label>
            </div>
             <div className="space-y-2">
              <Label htmlFor="secondaryGalleryName">Navn i menu</Label>
              <Input id="secondaryGalleryName" name="secondaryGalleryName" defaultValue={content.secondaryGalleryName} placeholder="F.eks. Lagersalg, Udsalg, Tilbud..."/>
              <p className="text-sm text-muted-foreground">Teksten, der vises i hovedmenuen for lagersalg-siden.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryGalleryTitle">Sidetitel</Label>
              <Input id="secondaryGalleryTitle" name="secondaryGalleryTitle" defaultValue={content.secondaryGalleryTitle} placeholder="F.eks. Stort Lagersalg"/>
              <p className="text-sm text-muted-foreground">Den store overskrift, der vises øverst på selve lagersalg-siden.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="secondaryGalleryDescription">Sidebeskrivelse</Label>
              <Textarea id="secondaryGalleryDescription" name="secondaryGalleryDescription" defaultValue={content.secondaryGalleryDescription} rows={3} />
              <p className="text-sm text-muted-foreground">Teksten, der vises under overskriften på lagersalg-siden.</p>
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
