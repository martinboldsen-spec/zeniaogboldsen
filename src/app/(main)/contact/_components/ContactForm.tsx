'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { submitContactForm } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? 'Sender...' : 'Send Besked'}
    </Button>
  );
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const artworkName = searchParams.get('artwork');
  const subject = searchParams.get('subject');
  const messageParam = searchParams.get('message');
  const fromCart = searchParams.get('from_cart');

  const getInitialMessage = () => {
    if (messageParam) {
        return messageParam;
    }
    if (artworkName) {
      return `Jeg er interesseret i værket "${artworkName}". `;
    }
    if (subject) {
        return `Jeg har et spørgsmål vedrørende "${subject}". `;
    }
    return '';
  }

  const [message, setMessage] = useState(getInitialMessage());

  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useFormState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const newInitialMessage = getInitialMessage();
    if (newInitialMessage !== message) {
        setMessage(newInitialMessage);
    }
  }, [searchParams]);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setMessage(''); // Clear the message field
    }
  }, [state]);
  
  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Navn</Label>
        <Input id="name" name="name" placeholder="Dit navn" required />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name.join(', ')}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="din@email.dk" required />
        {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email.join(', ')}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="message">Besked</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Din besked..."
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message.join(', ')}</p>}
      </div>
      {artworkName && (
        <input type="hidden" name="artwork" value={artworkName} />
      )}
       {subject && (
        <input type="hidden" name="subject" value={subject} />
      )}
      {fromCart && (
        <input type="hidden" name="from_cart" value={fromCart} />
      )}
      
      <SubmitButton />

      {state.message && (
        <p className={`text-sm ${state.errors ? 'text-destructive' : 'text-primary'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
