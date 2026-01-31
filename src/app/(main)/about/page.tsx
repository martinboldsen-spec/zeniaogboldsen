import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPageContent } from '@/lib/page-content-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, LinkIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getPageContent();
  const title = content?.about?.title || 'Om Kunstnerne';

  return {
    title: title,
  }
};

export default async function AboutPage() {
  const { content, error } = await getPageContent();

  if (error || !content?.about) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Indhold kunne ikke indlæses</AlertTitle>
          <AlertDescription>
            Der opstod en fejl under hentning af sidens indhold. Fejl: {error}
            <br /><br />
            <strong>Bemærk:</strong> Dette indhold styres fra filen `src/lib/page-content.json`.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const { 
    title = "Om Kunstnerne", 
    boldsen_image_url,
    boldsen_content,
    zenia_image_url,
    zenia_content,
    boldsen_website_url,
    zenia_website_url,
  } = content.about;

  return (
    <div className="container max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary text-center mb-12">
        {title}
      </h1>
      
      {/* Martin Boldsen Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <div className="w-full md:w-2/5">
            <div className="aspect-[4/5] relative overflow-hidden shadow-sm">
              <Image
                src={boldsen_image_url}
                alt="Martin Boldsen"
                fill
                unoptimized={true}
                className="object-cover"
                data-ai-hint="artist portrait"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
          <div className="w-full md:w-3/5">
            <h2 className="text-3xl font-bold font-headline text-primary mb-4">Martin Boldsen</h2>
            <div className="prose prose-lg max-w-none text-foreground/90">
              {boldsen_content.split('\n').map((paragraph, index) => (
                  <p key={index}>
                      {paragraph}
                  </p>
              ))}
            </div>
             {boldsen_website_url && (
                <div className="mt-6">
                    <Button asChild>
                        <Link href={boldsen_website_url} target="_blank" rel="noopener noreferrer">
                            Besøg Martin Boldsens Hjemmeside <LinkIcon className="ml-2" />
                        </Link>
                    </Button>
                </div>
            )}
          </div>
        </div>
      </section>

      <Separator className="my-16"/>

      {/* Anja Zenia Section */}
      <section>
        <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-start">
          <div className="w-full md:w-2/5">
            <div className="aspect-[4/5] relative overflow-hidden shadow-sm">
              <Image
                src={zenia_image_url}
                alt="Anja Zenia"
                fill
                unoptimized={true}
                className="object-cover"
                data-ai-hint="female artist portrait"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
          <div className="w-full md:w-3/5">
            <h2 className="text-3xl font-bold font-headline text-primary mb-4">Anja Zenia</h2>
            <div className="prose prose-lg max-w-none text-foreground/90">
              {zenia_content.split('\n').map((paragraph, index) => (
                  <p key={index}>
                      {paragraph}
                  </p>
              ))}
            </div>
             {zenia_website_url && (
                <div className="mt-6">
                    <Button asChild>
                        <Link href={zenia_website_url} target="_blank" rel="noopener noreferrer">
                           Besøg Anja Zenias Hjemmeside <LinkIcon className="ml-2" />
                        </Link>
                    </Button>
                </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
