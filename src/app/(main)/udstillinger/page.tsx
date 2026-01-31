import type { Metadata } from 'next';
import { getPageContent } from '@/lib/page-content-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import ExhibitionsPageClient from './_components/ExhibitionsPageClient';


export const metadata: Metadata = {
    title: 'Udstillinger',
    description: 'Se Martin Boldsens nuværende og tidligere udstillinger. Find information om galleri-samarbejder og se billeder fra ferniseringer.',
};


export default async function ExhibitionsPage() {
    const { content, error } = await getPageContent();

    if (error || !content?.exhibitions) {
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

    return <ExhibitionsPageClient {...content.exhibitions} />;
}
