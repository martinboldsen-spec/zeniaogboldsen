'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Artwork } from "@/lib/artwork-service";
import { updateArtworkAction } from "@/app/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gemmer...</> : 'Gem Ændringer'}
    </Button>
  );
}

export function ArtworkEditForm({ artwork }: { artwork: Artwork }) {
  const { toast } = useToast();
  
  const [state, formAction] = useFormState(updateArtworkAction, { message: null, errors: undefined });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.errors ? "Fejl" : "Gemt!",
        description: state.message,
        variant: state.errors ? "destructive" : "default",
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={artwork.id} />

      <Card>
        <CardHeader>
          <CardTitle>Generelle Oplysninger</CardTitle>
          <CardDescription>Administrer status, priser og synlighed for dette værk.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={artwork.status}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Vælg status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Tilgængelig</SelectItem>
                <SelectItem value="sold">Solgt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Pris (DKK)</Label>
            <Input id="price" name="price" type="number" defaultValue={artwork.price} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Rabat (%)</Label>
            <Input id="discount" name="discount" type="number" defaultValue={artwork.discount} placeholder="F.eks. 10 for 10%" />
          </div>
          <div></div> {/* Spacer */}
          <div className="flex items-center space-x-2 pt-6">
            <Switch id="isSecondary" name="isSecondary" defaultChecked={artwork.isSecondary} />
            <Label htmlFor="isSecondary">Vis på Lagersalg</Label>
          </div>
           <div className="flex items-center space-x-2 pt-6">
            <Switch id="atGallery" name="atGallery" defaultChecked={artwork.atGallery} />
            <Label htmlFor="atGallery">Er på galleri</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Beskrivelse</CardTitle>
          <CardDescription>Rediger beskrivelsen for dette værk.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description">Kunstværk Beskrivelse</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={artwork.description || ''}
              rows={10}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end items-center gap-4 mt-6">
          <SubmitButton />
      </div>
    </form>
  );
}
