import { getAllArtPrints } from "@/lib/art-print-service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditArtPrintsForm } from "./_components/EditArtPrintsForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const revalidate = 0;

export default function EditArtPrintsContentPage() {
  const artPrints = getAllArtPrints();

  if (!artPrints || artPrints.length === 0) {
    return (
       <div className="container py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Indhold kunne ikke indlæses</AlertTitle>
          <AlertDescription>
            Filen `src/lib/art-prints.json` kunne ikke findes eller er tom.
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
            <h1 className="text-2xl font-bold font-headline">Rediger Kunsttryk</h1>
        </div>

        <EditArtPrintsForm artPrints={artPrints} />
    </div>
  );
}
