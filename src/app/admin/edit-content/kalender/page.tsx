import { getAllCalendarEvents } from "@/lib/artwork-service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditCalendarForm } from "./_components/EditCalendarForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const revalidate = 0;

export default async function EditCalendarContentPage() {
  const { events, error } = await getAllCalendarEvents();

  if (error) {
    return (
       <div className="container py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Indhold kunne ikke indlæses</AlertTitle>
          <AlertDescription>
            Der opstod en fejl under hentning af kalender-begivenheder. Fejl: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div>
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tilbage til oversigt
            </Link>
        </Button>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-headline">Rediger Kalender</h1>
        </div>

        <EditCalendarForm events={events || []} />
    </div>
  );
}
