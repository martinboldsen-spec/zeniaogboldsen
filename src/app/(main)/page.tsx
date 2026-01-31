import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getPageContent } from '@/lib/page-content-service';
import { getAllArtworks } from '@/lib/artwork-service';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { PromoCarousel } from '@/app/(main)/_components/PromoCarousel';
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';
import { type FooterSocialLink } from '@/lib/page-content-service';

export const revalidate = 3600; // Revalidate every hour

const iconMap: Record<FooterSocialLink['platform'], React.ReactNode> = {
  instagram: <Instagram size={24} />,
  facebook: <Facebook size={24} />,
  linkedin: <Linkedin size={24} />,
  twitter: <Twitter size={24} />,
  youtube: <Youtube size={24} />,
};

export default async function HomePage() {
  const { content } = await getPageContent();
  const { artworks } = await getAllArtworks();

  // Separate artworks by artist, sort by date, and interleave them for the homepage
  const boldsenArtworks =
    artworks
      ?.filter((art) => art.artist === 'boldsen')
      .sort(
        (a, b) =>
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
      ) || [];

  const zeniaArtworks =
    artworks
      ?.filter((art) => art.artist === 'zenia')
      .sort(
        (a, b) =>
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
      ) || [];

  const latestArtworks = [];
  // Take up to 4 from each artist, alternating, for a total of 8
  for (let i = 0; i < 4; i++) {
    if (zeniaArtworks && zeniaArtworks[i]) {
      latestArtworks.push(zeniaArtworks[i]);
    }
    if (boldsenArtworks && boldsenArtworks[i]) {
      latestArtworks.push(boldsenArtworks[i]);
    }
  }

  // Use the content from the JSON file, with sane defaults if the file is missing/corrupt.
  const {
    home_hero_image_url,
    home_hero_title,
    home_hero_subtitle,
    home_intro_title,
    home_intro_content,
    home_intro_signature,
    home_intro_image_url,
    promo_carousel_slides,
    promo_carousel_active,
  } = content?.home || {
    home_hero_image_url: 'https://picsum.photos/seed/hero-gallery/1600/600',
    home_hero_title: 'Velkommen til Boldsen Kunst',
    home_hero_subtitle: 'Unikke malerier og kunstværker',
    home_intro_title: 'Rolig vildskab',
    home_intro_content:
      "Jeg elsker at skabe, og når jeg maler oplever jeg den mest umiddelbare og befriende forskellighed fra min ellers strukturerede hverdag. Farverne er altafgørende ..., der er ingen regler for deres sammensætning ..., hvis det føles rigtigt, så er det rigtigt.\n\nMine malerier giver et godt billede af hvem jeg er. På den ene side et behov for ro og stabilitet ..., men samtidig en konstant tiltrækning til den impulsive og farvestrålende vildskab.",
    home_intro_signature: 'Billedkunster Martin Boldsen',
    home_intro_image_url: 'https://picsum.photos/seed/rolig-vildskab/800/800',
    promo_carousel_slides: [],
    promo_carousel_active: true,
  };

  const { boldsen_website_url, zenia_website_url } = content?.about || {
    boldsen_website_url: '#',
    zenia_website_url: '#',
  };

  const { boldsen: boldsenContact, zenia: zeniaContact } = content?.contact || {
    boldsen: { social_links: [] },
    zenia: { social_links: [] },
  };

  const logoUrl = 'https://storage.googleapis.com/malerier/Z%26Bfill%20(1).png';

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="w-full">
        <div className="relative h-64 md:h-[500px] w-full">
          <Image
            src={home_hero_image_url}
            alt="Galleri med farverige malerier"
            fill
            unoptimized={true}
            className="object-cover"
            data-ai-hint="art gallery interior"
            priority
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center p-4 md:p-12">
            <div className="max-w-md bg-black/50 backdrop-blur-sm p-6 md:p-8 rounded-sm space-y-3">
              <Image
                src={logoUrl}
                alt="Zenia & Boldsen Logo"
                width={200}
                height={200}
                unoptimized={true}
                className="h-16 md:h-20 w-auto object-contain mx-auto invert"
                priority
              />
              <h1 className="text-3xl md:text-5xl font-bold font-headline text-white drop-shadow-lg">
                {home_hero_title}
              </h1>
              <p className="text-base md:text-xl text-white/90 drop-shadow-sm">
                {home_hero_subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Latest Artworks */}
        {latestArtworks && latestArtworks.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="font-headline text-3xl text-center text-primary mb-8">
              Seneste Værker
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {latestArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/galleri">Se hele galleriet</Link>
              </Button>
            </div>
          </section>
        )}

        {/* Promo Carousel Section */}
        {promo_carousel_active &&
          promo_carousel_slides &&
          promo_carousel_slides.length > 0 && (
            <section className="mb-8 md:mb-12">
              <PromoCarousel slides={promo_carousel_slides} />
            </section>
          )}

        {/* Intro & Artist Links Section */}
        <section className="mb-8 md:mb-12 bg-card p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left Column: Text */}
            <div>
              <div className="prose prose-lg max-w-none text-foreground/90">
                <h2 className="font-headline text-4xl text-primary">
                  {home_intro_title}
                </h2>
                {home_intro_content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p className="text-right italic text-muted-foreground mt-6">
                  {home_intro_signature}
                </p>
              </div>
            </div>

            {/* Right Column: Image and Links */}
            <div>
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={home_intro_image_url}
                  alt="Anja Zenia og Martin Boldsen"
                  fill
                  unoptimized={true}
                  className="object-cover"
                  data-ai-hint="artist couple portrait"
                />
              </div>
              <div className="mt-8">
                <p className="text-foreground/80 mb-6">
                  Galleriet her på siden viser et kurateret udvalg af vores
                  værker. For at se hele kollektionen, specifikke detaljer og
                  købsmuligheder, opfordrer vi dig til at besøge vores
                  individuelle hjemmesider.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-background p-6 border shadow-sm text-center flex flex-col">
                    <h3 className="font-headline text-2xl font-bold text-primary">
                      Martin Boldsen
                    </h3>
                    <p className="text-muted-foreground mt-1">Billedkunstner</p>
                    <Button asChild className="mt-4 w-full">
                      <Link
                        href={boldsen_website_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Besøg Hjemmeside
                      </Link>
                    </Button>
                    <div className="flex-grow" />
                    <div className="flex justify-center space-x-4 mt-4">
                      {boldsenContact?.social_links?.map((link) => (
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
                  <div className="bg-background p-6 border shadow-sm text-center flex flex-col">
                    <h3 className="font-headline text-2xl font-bold text-primary">
                      Anja Zenia
                    </h3>
                    <p className="text-muted-foreground mt-1">Keramiker</p>
                    <Button asChild className="mt-4 w-full">
                      <Link
                        href={zenia_website_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Besøg Hjemmeside
                      </Link>
                    </Button>
                    <div className="flex-grow" />
                    <div className="flex justify-center space-x-4 mt-4">
                      {zeniaContact?.social_links?.map((link) => (
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
