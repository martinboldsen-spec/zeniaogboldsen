import { getArtworkById } from "@/lib/artwork-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArtworkEditForm } from "./_components/EditForm";

export const revalidate = 0;

export default async function EditArtworkPage({ params }: { params: { id: string }}) {
  const { artwork, error } = await getArtworkById(params.id);

  if (!artwork) {
    if (error) console.error(error);
    notFound();
  }

  return (
    <div>
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin/artworks">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tilbage til værk-oversigt
            </Link>
        </Button>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-headline">Rediger Værk: {artwork.name}</h1>
        </div>

        <ArtworkEditForm artwork={artwork} />
    </div>
  );
}
