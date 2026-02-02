import type { CalendarEvent } from '@/lib/artwork-service';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';

type EventCardProps = {
  event: CalendarEvent;
};

function formatDateRange(startDate: string, endDate: string): string {
    const parseAsLocalDate = (dateString: string) => {
        if (!dateString || !dateString.includes('-')) return new Date(); // Fallback for safety
        const parts = dateString.split('-').map(s => parseInt(s, 10));
        // new Date(year, monthIndex, day)
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };

    const start = parseAsLocalDate(startDate);
    const end = parseAsLocalDate(endDate);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const startStr = start.toLocaleDateString('da-DK', options);
    const endStr = end.toLocaleDateString('da-DK', options);

    if (startStr === endStr) {
        return startStr;
    }

    if (start.getFullYear() !== end.getFullYear()) {
        return `${startStr} - ${endStr}`;
    }

    if (start.getMonth() !== end.getMonth()) {
        return `${start.toLocaleDateString('da-DK', { day: 'numeric', month: 'long' })} - ${endStr}`;
    }

    return `${start.toLocaleDateString('da-DK', { day: 'numeric' })}. - ${endStr}`;
}


export function EventCard({ event }: EventCardProps) {
  const dateRange = formatDateRange(event.startDate, event.endDate);

  return (
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl md:flex">
        <div className="md:w-1/3 relative aspect-video md:aspect-auto">
            {event.imageUrl && (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                unoptimized={true}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            )}
        </div>
        <div className="md:w-2/3 flex flex-col">
            <CardContent className="p-6 flex-grow">
                <h3 className="font-headline text-2xl font-semibold text-primary">{event.title}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{dateRange}</span>
                </div>
                <p className="text-foreground/80">
                    {event.description}
                </p>
            </CardContent>
             {event.link && (
                <div className="p-6 pt-0">
                    <Button asChild>
                        <Link href={event.link} target="_blank" rel="noopener noreferrer">
                           Læs mere <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
            )}
        </div>
      </Card>
  );
}
