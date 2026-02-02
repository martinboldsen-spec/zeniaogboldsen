import type { Metadata } from 'next';
import { getAllCalendarEvents } from '@/lib/artwork-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { EventCard } from './_components/EventCard';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
    title: 'Kalender',
    description: 'Kommende udstillinger, messer og begivenheder hvor du kan opleve værker af Zenia & Boldsen.',
};

export default async function CalendarPage() {
    const { events, error } = await getAllCalendarEvents();

    const upcomingEvents = events
        ?.filter(event => new Date(event.endDate) >= new Date())
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    if (error) {
        return (
          <div className="container py-12">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Der opstod en fejl</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        );
    }

    return (
        <>
            <section className="container max-w-7xl mx-auto py-12 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                    Kalender
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                    Kommende udstillinger, messer og begivenheder hvor du kan opleve vores værker.
                </p>
            </section>
            <section className="container max-w-4xl mx-auto px-4 pb-16">
                 {(!upcomingEvents || upcomingEvents.length === 0) ? (
                     <div className="text-center py-16 bg-card border shadow-sm">
                        <p className="text-xl text-muted-foreground">Der er ingen kommende begivenheder i kalenderen.</p>
                    </div>
                 ) : (
                    <div className="flex flex-col gap-8">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                 )}
            </section>
        </>
    );
}
