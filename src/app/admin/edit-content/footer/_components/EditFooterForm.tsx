"use client";

import { useFormState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { FooterPageContent, FooterSocialLink } from "@/lib/page-content-service";
import { updateFooterPageAction } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gemmer...</> : 'Gem Indhold'}
    </Button>
  );
}

const socialPlatforms: FooterSocialLink['platform'][] = ['instagram', 'facebook', 'linkedin', 'twitter', 'youtube'];

export function EditFooterForm({ content }: { content: FooterPageContent }) {
  const [updateState, formAction] = useFormState(updateFooterPageAction, { message: null, errors: {} });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sideindhold: Footer</CardTitle>
        <CardDescription>Rediger copyright-teksten og de sociale medier-links, der vises i footeren på hele siden.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Tekst</Label>
            <Input id="copyright" name="copyright" defaultValue={content.copyright} />
          </div>
          
          <div className="space-y-4">
            <Label>Sociale Medier Links</Label>
            {Array.from({ length: 4 }).map((_, index) => {
                const link = content.social_links?.[index];
                return (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                        <div className="space-y-2">
                             <Label htmlFor={`platform-${index}`} className="text-xs">Platform</Label>
                             <Select name={`social_links.${index}.platform`} defaultValue={link?.platform}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Vælg platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {socialPlatforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`url-${index}`} className="text-xs">URL</Label>
                             <Input 
                                id={`url-${index}`} 
                                name={`social_links.${index}.url`} 
                                defaultValue={link?.url}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                )
            })}
             <p className="text-sm text-muted-foreground">Efterlad felter tomme for at fjerne et link. Kun udfyldte par af 'Platform' og 'URL' vil blive gemt.</p>
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
