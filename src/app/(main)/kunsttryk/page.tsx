import type { Metadata } from 'next';
import { getAllArtPrints } from '@/lib/art-print-service';
import { ArtPrintCard } from './_components/ArtPrintCard';

export const metadata: Metadata = {
    title: 'Kunsttryk',
    description: 'Køb kunsttryk af udvalgte originale malerier af Martin Boldsen. Plakater i høj kvalitet, tilgængelige med eller uden ramme.',
};

export default function ArtPrintsPage() {
    const prints = getAllArtPrints();

    return (
        <>
            <section className="container max-w-7xl mx-auto py-12 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                    Kunsttryk
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                    Udvalgte værker fås nu som eksklusive kunsttryk. En perfekt måde at bringe kunsten ind i dit hjem på. Alle tryk er i 70x90 cm og trykt på 230g mat kvalitetspapir.
                </p>
            </section>
            <section className="container max-w-7xl mx-auto px-4 pb-16">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {prints.map((print) => (
                        <ArtPrintCard key={print.id} artPrint={print} />
                    ))}
                </div>
            </section>
        </>
    );
}
