import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactPageClient } from './_components/ContactPageClient';
import { getPageContent } from '@/lib/page-content-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';


export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getPageContent();
  const title = content?.contact?.title || 'Kontakt';
  const description = content?.contact?.description || 'Kontakt kunstnerparret Zenia & Boldsen for spørgsmål, kommissioner eller atelierbesøg.';

  return {
    title: title,
    description: description.substring(0, 160),
  }
};

export default async function ContactPage() {
  const { content, error } = await getPageContent();
  
  if (error || !content?.contact) {
     return (
      <div className="container py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Indhold kunne ikke indlæses</AlertTitle>
          <AlertDescription>
            Der opstod en fejl under hentning af sidens indhold. Fejl: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="container max-w-5xl mx-auto py-16 px-4 text-center">Indlæser...</div>}>
        <ContactPageClient content={content.contact} />
    </Suspense>
  );
}
