'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const [errorMessage, formAction] = useFormState(
    authenticate,
    undefined,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log ind</CardTitle>
        <CardDescription>Indtast dine admin-oplysninger for at fortsætte.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="username">Brugernavn</Label>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="Indtast brugernavn"
              required
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="password">Adgangskode</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Indtast adgangskode"
              required
            />
          </div>
          <LoginButton />
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{errorMessage}</p>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logger ind...</> : 'Log ind'}
    </Button>
  );
}
