'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Artwork, ArtworkType } from '@/lib/artwork-service';
import { Button } from '@/components/ui/button';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ArtworkCategory = 'all' | 'painting' | 'keramik';

const ITEMS_PER_PAGE = 12;

const categoryFilterOptions: { label: string; value: ArtworkCategory }[] = [
  { label: 'Alle Værker', value: 'all' },
  { label: 'Malerier', value: 'painting' },
  { label: 'Keramik', value: 'keramik' },
];


export function ArtworkFilterGridClient({ artworks }: { artworks: Artwork[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Read initial state from URL
    const getInitialCategory = () => {
        const params = new URLSearchParams(searchParams);
        return (params.get('category') as ArtworkCategory) || (params.get('filter') as ArtworkCategory) || 'all';
    };
    
    const getInitialPage = () => {
        const params = new URLSearchParams(searchParams);
        return parseInt(params.get('page') || '1', 10);
    };

    const [category, setCategory] = useState<ArtworkCategory>(getInitialCategory);
    const [page, setPage] = useState(getInitialPage);


    // Update URL when filters or page change
    useEffect(() => {
        const params = new URLSearchParams();
        if (category !== 'all') params.set('category', category);
        if (page > 1) params.set('page', page.toString());
        
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [category, page, pathname, router]);

    // Handle incoming `filter` param from other pages (e.g. homepage links)
    useEffect(() => {
        const initialCategory = searchParams.get('filter') as ArtworkCategory | null;
        if (initialCategory && initialCategory !== category) {
            setCategory(initialCategory);
            setPage(1); // Reset pagination
        }
    }, [searchParams, category]);

    const handleFilterChange = (value: string) => {
        setCategory(value as ArtworkCategory);
        setPage(1); // Reset pagination on filter change
    }

  const filteredArtworks = useMemo(() => {
    return artworks
    .filter(artwork => {
        if (category === 'all') return true;
        if (category === 'painting') {
            return artwork.type === 'painting';
        }
        if (category === 'keramik') {
            return artwork.type === 'keramik' || artwork.type === 'vægkunst';
        }
        return artwork.type === category;
    })
    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  }, [artworks, category]);

  const visibleCount = page * ITEMS_PER_PAGE;
  const visibleArtworks = filteredArtworks.slice(0, visibleCount);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  }

  return (
    <section className="container max-w-7xl mx-auto px-4 pb-16">
        {/* Desktop Filters */}
        <div className="hidden md:flex flex-col items-center gap-4 mb-8">
            <div className="flex justify-center flex-wrap items-center gap-4">
                <div className="flex justify-center flex-wrap gap-2">
                    {categoryFilterOptions.map((option) => (
                    <Button
                        key={option.value}
                        variant={category === option.value ? 'default' : 'outline'}
                        onClick={() => handleFilterChange(option.value)}
                    >
                        {option.label}
                    </Button>
                    ))}
                </div>
            </div>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden grid grid-cols-1 gap-2 mb-8">
            <Select value={category} onValueChange={(value) => handleFilterChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vælg type..." />
              </SelectTrigger>
              <SelectContent>
                {categoryFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
      
      {filteredArtworks.length === 0 && (
        <div className="text-center col-span-full py-12">
            <p className="text-muted-foreground">Ingen værker matcher de valgte filtre.</p>
        </div>
      )}

      {visibleCount < filteredArtworks.length && (
        <div className="text-center mt-12">
            <Button onClick={handleLoadMore} size="lg">
                Indlæs Flere Værker
            </Button>
        </div>
      )}
    </section>
  );
}
