"use client";

import { useFormState, useFormStatus } from "react-dom";
import type {
  ContactPageContent,
  FooterSocialLink,
} from "@/lib/page-content-service";
import { updateContactPageAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gemmer...
        </>
      ) : (
        'Gem Indhold'
      )}
    </Button>
  );
}

const socialPlatforms: FooterSocialLink['platform'][] = [
  'instagram',
  'facebook',
  'linkedin',
  'twitter',
  'youtube',
];

export function EditContactForm({ content }: { content: ContactPageContent }) {
  const [updateState, formAction] = useFormState(updateContactPageAction, {
    message: null,
    errors: {},
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sideindhold: Kontakt</CardTitle>
        <CardDescription>
          Rediger kontaktoplysningerne, der vises på siden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
          {/* Fælles indhold */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Overskrift</Label>
              <Input id="title" name="title" defaultValue={content.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beskrivelse</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={content.description}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Fælles Adresse</Label>
              <Input
                id="address"
                name="address"
                defaultValue={content.address}
              />
            </div>
          </div>

          <Separator />

          {/* Martin Boldsen */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Martin Boldsen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="boldsen_email">Email (Martin)</Label>
                <Input
                  id="boldsen_email"
                  name="boldsen_email"
                  defaultValue={content.boldsen.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boldsen_phone">Telefon (Martin)</Label>
                <Input
                  id="boldsen_phone"
                  name="boldsen_phone"
                  defaultValue={content.boldsen.phone}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="boldsen_cvr">CVR-nummer (Martin)</Label>
              <Input
                id="boldsen_cvr"
                name="boldsen_cvr"
                defaultValue={content.boldsen.cvr}
              />
            </div>
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm">
                Sociale Medier (Martin)
              </h4>
              {Array.from({ length: 2 }).map((_, index) => {
                const link = content.boldsen.social_links?.[index];
                return (
                  <div
                    key={`boldsen-social-${index}`}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor={`boldsen_platform_${index}`}
                        className="text-xs"
                      >
                        Platform
                      </Label>
                      <Select
                        name={`boldsen_social_links.${index}.platform`}
                        defaultValue={link?.platform}
                      >
                        <SelectTrigger id={`boldsen_platform_${index}`}>
                          <SelectValue placeholder="Vælg platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`boldsen_url_${index}`}
                        className="text-xs"
                      >
                        URL
                      </Label>
                      <Input
                        id={`boldsen_url_${index}`}
                        name={`boldsen_social_links.${index}.url`}
                        defaultValue={link?.url}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Anja Zenia */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Anja Zenia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zenia_email">Email (Anja)</Label>
                <Input
                  id="zenia_email"
                  name="zenia_email"
                  defaultValue={content.zenia.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zenia_phone">Telefon (Anja)</Label>
                <Input
                  id="zenia_phone"
                  name="zenia_phone"
                  defaultValue={content.zenia.phone}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zenia_cvr">CVR-nummer (Anja)</Label>
              <Input
                id="zenia_cvr"
                name="zenia_cvr"
                defaultValue={content.zenia.cvr}
              />
            </div>
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm">Sociale Medier (Anja)</h4>
              {Array.from({ length: 2 }).map((_, index) => {
                const link = content.zenia.social_links?.[index];
                return (
                  <div
                    key={`zenia-social-${index}`}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor={`zenia_platform_${index}`}
                        className="text-xs"
                      >
                        Platform
                      </Label>
                      <Select
                        name={`zenia_social_links.${index}.platform`}
                        defaultValue={link?.platform}
                      >
                        <SelectTrigger id={`zenia_platform_${index}`}>
                          <SelectValue placeholder="Vælg platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`zenia_url_${index}`} className="text-xs">
                        URL
                      </Label>
                      <Input
                        id={`zenia_url_${index}`}
                        name={`zenia_social_links.${index}.url`}
                        defaultValue={link?.url}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-6 border-t">
            {updateState?.message && (
              <p className="text-sm text-muted-foreground">
                {updateState.message}
              </p>
            )}
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
