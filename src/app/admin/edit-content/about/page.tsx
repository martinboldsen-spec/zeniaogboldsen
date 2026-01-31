import { getPageContent } from "@/lib/page-content-service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditAboutForm } from "./_components/EditAboutForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const revalidate = 0;

export default async function EditAboutContentPage() {
  const { content, error } = await getPageContent();

  if (error || !content?.about) {
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
    <div>
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tilbage til oversigt
            </Link>
        </Button>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-headline">Rediger "Om Os" side</h1>
        </div>

        <EditAboutForm content={content.about} />
    </div>
  );
}
