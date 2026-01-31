"use client";

import { useFormState, useState } from "react";
import { useFormStatus } from "react-dom";
import type {
  FooterPageContent,
  FooterSocialLink,
} from "@/lib/page-content-service";
import { updateFooterPageAction } from "@/app/lib/actions";
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
import { Loader2, Trash } from "lucide-react";
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

export function EditFooterForm({ content }: { content: FooterPageContent }) {
  const [updateState, formAction] = useFormState(updateFooterPageAction, {
    message: null,
    errors: {},
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sideindhold: Footer</CardTitle>
        <CardDescription>
          Rediger copyright-teksten der vises i footeren på hele siden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Tekst</Label>
            <Input
              id="copyright"
              name="copyright"
              defaultValue={content.copyright}
            />
          </div>

          <div className="flex justify-end items-center gap-4">
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
