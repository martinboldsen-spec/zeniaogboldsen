'use client'

import { Mail, Phone, MapPin, FileText } from 'lucide-react';
import { ContactForm } from './ContactForm';
import type { ContactPageContent } from '@/lib/page-content-service';
import { Separator } from '@/components/ui/separator';


export function ContactPageClient({ content }: { content: ContactPageContent }) {
  const { title, description, address, boldsen, zenia } = content;

  return (
    <div className="container max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          {title || "Kontakt Os"}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          {description || "Har du spørgsmål, er interesseret i et værk, eller ønsker du at diskutere en kommission? Tøv ikke med at række ud."}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Send en besked</h2>
            <ContactForm />
        </div>
        <div className="flex flex-col justify-start space-y-8">
            
            {/* Martin Boldsen */}
            <div>
                <h3 className="text-xl font-bold font-headline text-primary mb-4">Martin Boldsen</h3>
                <div className="space-y-5">
                    <div className="flex items-start gap-4">
                        <Mail className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Email</h4>
                            <a href={`mailto:${boldsen.email}`} className="text-sm text-foreground/80 hover:underline">
                                {boldsen.email}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Telefon</h4>
                            <a href={`tel:${boldsen.phone.replace(/\s/g, '')}`} className="text-sm text-foreground/80 hover:underline">
                                {boldsen.phone}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <FileText className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">CVR</h4>
                            <p className="text-sm text-foreground/80">{boldsen.cvr}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />
            
            {/* Anja Zenia */}
            <div>
                <h3 className="text-xl font-bold font-headline text-primary mb-4">Anja Zenia</h3>
                 <div className="space-y-5">
                    <div className="flex items-start gap-4">
                        <Mail className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Email</h4>
                            <a href={`mailto:${zenia.email}`} className="text-sm text-foreground/80 hover:underline">
                                {zenia.email}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Telefon</h4>
                            <a href={`tel:${zenia.phone.replace(/\s/g, '')}`} className="text-sm text-foreground/80 hover:underline">
                                {zenia.phone}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <FileText className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">CVR</h4>
                            <p className="text-sm text-foreground/80">{zenia.cvr}</p>
                        </div>
                    </div>
                </div>
            </div>

             <Separator />

             {/* Fælles Adresse */}
             <div>
                <h3 className="text-xl font-bold font-headline text-primary mb-4">Fælles Atelier</h3>
                <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold">Adresse</h4>
                        <p className="text-sm text-foreground/80">{address}</p>
                        <p className="text-xs text-muted-foreground">Besøg kun efter aftale</p>
                    </div>
                </div>
             </div>

        </div>
      </div>
    </div>
  );
}
