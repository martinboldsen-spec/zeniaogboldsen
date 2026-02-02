"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { CalendarEvent } from "@/lib/artwork-service";
import { updateCalendarPageAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { da } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gemmer Kalender...</> : 'Gem Kalender'}
    </Button>
  );
}

// A custom date picker component for the form
function DatePicker({ name, defaultValue }: { name: string, defaultValue?: string }) {
    const parseAsLocalDate = (dateString?: string) => {
        if (!dateString) return undefined;
        // Split to avoid timezone issues where 'YYYY-MM-DD' is parsed as UTC.
        // This ensures the date is treated as local.
        const parts = dateString.split('-').map(s => parseInt(s, 10));
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };

    const [date, setDate] = useState<Date | undefined>(parseAsLocalDate(defaultValue));
    const [hiddenValue, setHiddenValue] = useState<string>(defaultValue || "");

    useEffect(() => {
        if (date) {
            // Timezone-safe formatting to YYYY-MM-DD string
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            setHiddenValue(`${year}-${month}-${day}`);
        } else {
            setHiddenValue('');
        }
    }, [date]);

    // Handles updates if the parent component re-renders with a new defaultValue
    useEffect(() => {
        setDate(parseAsLocalDate(defaultValue));
    }, [defaultValue]);

    return (
        <>
            <input type="hidden" name={name} value={hiddenValue} />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "d. MMMM yyyy", { locale: da }) : <span>Vælg en dato</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={da}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}

export function EditCalendarForm({ events }: { events: CalendarEvent[] }) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(updateCalendarPageAction, { message: null, errors: {} });
  
  useEffect(() => {
    if (state.message) {
      toast({
        title: state.errors ? "Fejl" : "Gemt!",
        description: state.message,
        variant: state.errors ? "destructive" : "default",
      });
    }
  }, [state, toast]);


  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Kalenderbegivenheder</CardTitle>
          <CardDescription>
            Administrer kommende begivenheder. Efterlad titel-feltet tomt for at fjerne en begivenhed.
            Begivenheder sorteres automatisk efter startdato og fjernes fra den offentlige side efter slutdato.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {Array.from({ length: 10 }).map((_, index) => {
                const event = events?.[index];
                return (
                    <div key={index} className="p-4 border rounded-md space-y-4 relative">
                        <h4 className="text-md font-semibold">Begivenhed #{index + 1}</h4>
                        <input type="hidden" name={`events.${index}.id`} defaultValue={event?.id || `event-${Date.now()}-${index}`} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor={`event_title_${index}`} className="text-xs">Overskrift</Label>
                                <Input id={`event_title_${index}`} name={`events.${index}.title`} defaultValue={event?.title} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor={`event_image_${index}`} className="text-xs">Billede URL</Label>
                                <Input id={`event_image_${index}`} name={`events.${index}.imageUrl`} defaultValue={event?.imageUrl} placeholder="https://..."/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`event_desc_${index}`} className="text-xs">Kort beskrivelse</Label>
                            <Textarea id={`event_desc_${index}`} name={`events.${index}.description`} defaultValue={event?.description} rows={2} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor={`event_start_date_${index}`} className="text-xs">Startdato</Label>
                                <DatePicker name={`events.${index}.startDate`} defaultValue={event?.startDate} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`event_end_date_${index}`} className="text-xs">Slutdato</Label>
                                <DatePicker name={`events.${index}.endDate`} defaultValue={event?.endDate} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`event_link_${index}`} className="text-xs">Link (valgfrit)</Label>
                                <Input id={`event_link_${index}`} name={`events.${index}.link`} defaultValue={event?.link} placeholder="https://..."/>
                            </div>
                        </div>
                    </div>
                )
            })}
        </CardContent>
      </Card>
      <div className="flex justify-end items-center gap-4 mt-6">
        <SubmitButton />
      </div>
    </form>
  );
}
