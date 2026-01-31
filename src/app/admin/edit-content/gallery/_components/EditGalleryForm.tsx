"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { GalleryPageContent } from "@/lib/page-content-service";
import { updateGalleryPageAction } from "@/app/lib/actions";
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

export function EditGalleryForm({ content }: { content: GalleryPageContent }) {
  const [updateState, formAction] = useFormState(updateGalleryPageAction, { message: null, errors: {} });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sideindhold: Galleri</CardTitle>
        <CardDescription>Rediger overskrift og beskrivelse for "Galleri" siden. Ændringerne vil blive vist med det samme.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input id="title" name="title" defaultValue={content.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea id="description" name="description" defaultValue={content.description} rows={5} />
          </div>
          
          <div className="flex justify-end items-center gap-4">
              {updateState?.message && <p className="text-sm text-muted-foreground">{updateState.message}</p>}
              <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
