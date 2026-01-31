import { Instagram, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { getPageContent, type FooterSocialLink } from '@/lib/page-content-service';

const iconMap: Record<FooterSocialLink['platform'], React.ReactNode> = {
  instagram: <Instagram size={20} />,
  facebook: <Facebook size={20} />,
  linkedin: <Linkedin size={20} />,
  twitter: <Twitter size={20} />,
  youtube: <Youtube size={20} />,
};


export async function Footer() {
  const { content } = await getPageContent();
  const { copyright, social_links } = content?.footer || { copyright: '', social_links: [] };
  
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            {copyright || `© ${new Date().getFullYear()} Martin Boldsen. Alle rettigheder forbeholdes.`}
          </p>
          <div className="flex space-x-4">
            {social_links.map((link) => (
                <Link 
                    key={link.platform} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={link.platform}
                >
                    {iconMap[link.platform]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
