import { getAllArtworks, Artwork } from "@/lib/artwork-service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const revalidate = 0; // No caching for admin page - always fetch latest data

export default async function AdminArtworksPage() {
  const { artworks, error } = await getAllArtworks();

  return (
    <div>
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tilbage til Administration
            </Link>
        </Button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-headline">Administration af Værker</h1>
      </div>
      
       {error && (
        <Alert variant="destructive" className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Der opstod en fejl</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artworks && artworks.length > 0 ? (
              artworks.map((artwork: Artwork) => (
                <TableRow key={artwork.id}>
                  <TableCell className="font-medium">{artwork.name}</TableCell>
                  <TableCell>{artwork.type}</TableCell>
                  <TableCell>
                    <Badge variant={artwork.status === 'sold' ? 'secondary' : 'default'}
                      className={artwork.status === 'available' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}
                    >
                      {artwork.status === 'sold' ? 'Solgt' : 'Tilgængelig'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/edit/${artwork.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Rediger</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Ingen værker fundet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
