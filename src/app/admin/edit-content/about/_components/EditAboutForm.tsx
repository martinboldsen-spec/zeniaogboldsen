"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { AboutPageContent } from "@/lib/page-content-service";
import { updateAboutPageAction } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gemmer...</> : 'Gem Indhold'}
    </Button>
  );
}

export function EditAboutForm({ content }: { content: AboutPageContent }) {
  const [updateState, formAction] = useFormState(updateAboutPageAction, { message: null, errors: {} });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sideindhold: Om Os</CardTitle>
        <CardDescription>Rediger felterne for "Om Os" siden. Ændringerne vil blive vist med det samme.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Sidetitel</Label>
            <Input id="title" name="title" defaultValue={content.title} />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Martin Boldsen</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="boldsen_image_url">Billed-URL (Martin)</Label>
                <Input id="boldsen_image_url" name="boldsen_image_url" defaultValue={content.boldsen_image_url} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boldsen_content">Brødtekst (Martin)</Label>
                <Textarea id="boldsen_content" name="boldsen_content" defaultValue={content.boldsen_content} rows={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boldsen_website_url">Hjemmeside-URL (Martin)</Label>
                <Input id="boldsen_website_url" name="boldsen_website_url" defaultValue={content.boldsen_website_url} placeholder="https://www.eksempel.dk" />
              </div>
            </div>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Anja Zenia</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zenia_image_url">Billed-URL (Anja)</Label>
                <Input id="zenia_image_url" name="zenia_image_url" defaultValue={content.zenia_image_url} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zenia_content">Brødtekst (Anja)</Label>
                <Textarea id="zenia_content" name="zenia_content" defaultValue={content.zenia_content} rows={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zenia_website_url">Hjemmeside-URL (Anja)</Label>
                <Input id="zenia_website_url" name="zenia_website_url" defaultValue={content.zenia_website_url} placeholder="https://www.eksempel.dk" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-4 border-t pt-6 mt-6">
              {updateState?.message && <p className="text-sm text-muted-foreground">{updateState.message}</p>}
              <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
