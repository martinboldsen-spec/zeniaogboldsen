'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getPageContent, type SeoPageContent } from '@/lib/page-content-service';


const baseNavLinks = [
  { href: '/', label: 'Forside' },
  { href: '/galleri', label: 'Galleri' },
  { href: '/udstillinger', label: 'Udstillinger' },
  { href: '/kalender', label: 'Kalender' },
  { href: '/about', label: 'Om Os' },
  { href: '/contact', label: 'Kontakt' },
];

const logoUrl = "https://storage.googleapis.com/malerier/Z%26Bfill%20(1).png";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [seo, setSeo] = useState<SeoPageContent | null>(null);

   useEffect(() => {
    getPageContent().then(({ content }) => {
      if (content?.seo) {
        setSeo(content.seo);
      }
    });
  }, []);

  const navLinks = [...baseNavLinks];
  if (seo?.secondaryGalleryActive && seo?.secondaryGalleryName) {
    navLinks.splice(2, 0, { href: '/lagersalg', label: seo.secondaryGalleryName });
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-7xl items-center">
        <Link href="/" className="flex items-center mr-auto">
            <Image
                src={logoUrl}
                alt="Zenia & Boldsen Logo"
                width={216}
                height={48}
                unoptimized={true}
                className="h-16 w-auto object-contain"
                priority
            />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary text-foreground/60',
                 link.href === '/lagersalg' && 'p-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 hover:text-accent-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 ml-4">
            <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Åbn menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="flex flex-col space-y-4 pt-10">
                        <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                            <Image
                                src={logoUrl}
                                alt="Zenia & Boldsen Logo"
                                width={216}
                                height={48}
                                unoptimized={true}
                                className="h-12 w-auto object-contain"
                                priority
                            />
                        </Link>
                        <div className="flex flex-col space-y-4 pt-6">
                            {navLinks.map((link) => (
                                <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    'text-lg transition-colors hover:text-primary text-foreground/80',
                                    link.href === '/lagersalg' && 'p-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 hover:text-accent-foreground'
                                )}
                                >
                                {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                  </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
