import Link from 'next/link';
import { getPageContent } from '@/lib/page-content-service';

export async function Footer() {
  const { content } = await getPageContent();
  const { copyright } = content?.footer || {
    copyright: '',
  };

  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            {copyright ||
              `© ${new Date().getFullYear()} Martin Boldsen. Alle rettigheder forbeholdes.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
