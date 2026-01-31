'use server';

import fs from 'fs/promises';
import path from 'path';

export interface AboutPageContent {
  title: string;
  boldsen_image_url: string;
  boldsen_content: string;
  zenia_image_url: string;
  zenia_content: string;
  boldsen_website_url?: string;
  zenia_website_url?: string;
}

export interface PromoCarouselSlide {
  title: string;
  description: string;
  media_url: string;
  media_type: 'image' | 'video';
  button_text: string;
  button_link: string;
}

export interface HomePageContent {
  home_hero_image_url: string;
  home_hero_title: string;
  home_hero_subtitle: string;
  home_intro_title: string;
  home_intro_content: string;
  home_intro_signature: string;
  home_intro_image_url: string;
  promo_carousel_slides: PromoCarouselSlide[];
  promo_carousel_active?: boolean;
}

export interface GalleryPageContent {
  title: string;
  description: string;
}

export interface FooterSocialLink {
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube';
  url: string;
}

export interface IndividualContactInfo {
  email: string;
  phone: string;
  cvr: string;
  social_links?: FooterSocialLink[];
}

export interface ContactPageContent {
  title: string;
  description: string;
  address: string;
  boldsen: IndividualContactInfo;
  zenia: IndividualContactInfo;
}

export interface FooterPageContent {
  copyright: string;
}

export interface ExhibitionPartner {
  name: string;
  image_url: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
}

export interface ExhibitionGalleryImage {
  url: string;
  caption?: string;
  date?: string;
}

export interface ExhibitionsPageContent {
  title: string;
  description: string;
  gallery_title: string;
  partners: ExhibitionPartner[];
  gallery_images: ExhibitionGalleryImage[];
}

export interface SeoPageContent {
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  googleAnalyticsId: string;
  headerScript: string;
  ogImageUrl?: string;
  secondaryGalleryActive: boolean;
  secondaryGalleryName: string;
  secondaryGalleryTitle: string;
  secondaryGalleryDescription: string;
}

interface PageContent {
  about: AboutPageContent;
  home: HomePageContent;
  gallery: GalleryPageContent;
  contact: ContactPageContent;
  footer: FooterPageContent;
  exhibitions: ExhibitionsPageContent;
  seo: SeoPageContent;
}

const contentFilePath = path.resolve(process.cwd(), 'src/lib/page-content.json');

async function readContentFile(): Promise<PageContent> {
  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Could not read page content file:', error);
    // Return default structure if file is empty or corrupt
    return {
      about: {
        title: 'Om Kunstnerne',
        boldsen_image_url: 'https://picsum.photos/seed/boldsen-artist/800/800',
        boldsen_content: 'Indhold for Martin Boldsen mangler.',
        zenia_image_url: 'https://picsum.photos/seed/zenia-artist/800/800',
        zenia_content: 'Indhold for Anja Zenia mangler.',
      },
      home: {
        home_hero_image_url: 'https://picsum.photos/seed/hero-gallery/1600/600',
        home_hero_title: 'Velkommen til Zenia & Boldsen',
        home_hero_subtitle: 'Unikke kunstværker og keramik',
        home_intro_title: 'To kunstnere, et univers',
        home_intro_content: 'Indhold mangler...',
        home_intro_signature: 'Zenia & Boldsen',
        home_intro_image_url: 'https://picsum.photos/seed/rolig-vildskab/800/800',
        promo_carousel_slides: [],
        promo_carousel_active: true,
      },
      gallery: {
        title: 'Udforsk Værkerne',
        description:
          'Velkommen til vores fælles galleri. Her kan du dykke ned i Martins malerier og Anjas keramiske værker.',
      },
      contact: {
        title: 'Kontakt Os',
        description:
          'Har du spørgsmål, er interesseret i et værk, eller ønsker du at diskutere en kommission? Tøv ikke med at række ud.',
        address: 'Atelier i Slagelse (Besøg efter aftale)',
        boldsen: {
          email: 'boldsen@email.dk',
          phone: '+45 00 00 00 01',
          cvr: '11111111',
        },
        zenia: {
          email: 'zenia@email.dk',
          phone: '+45 00 00 00 02',
          cvr: '22222222',
        },
      },
      footer: {
        copyright: `© ${new Date().getFullYear()} Zenia & Boldsen. Alle rettigheder forbeholdes.`,
      },
      exhibitions: {
        title: 'Udstillinger & Samarbejder',
        description:
          'Her kan du se vores nuværende og tidligere udstillinger.',
        gallery_title: 'Galleri fra Udstillinger',
        partners: [],
        gallery_images: [],
      },
      seo: {
        defaultTitle: 'Zenia & Boldsen | Kunst og Keramik',
        titleTemplate: '%s | Zenia & Boldsen',
        description:
          'Udforsk de unikke malerier af Martin Boldsen og keramik af Anja Zenia.',
        keywords: [
          'kunst',
          'galleri',
          'malerier',
          'keramik',
          'martin boldsen',
          'anja zenia',
        ],
        googleAnalyticsId: '',
        headerScript: '',
        ogImageUrl: '',
        secondaryGalleryActive: false,
        secondaryGalleryName: 'Lagersalg',
        secondaryGalleryTitle: 'Lagersalg',
        secondaryGalleryDescription:
          'Her finder du et udvalg af værker til nedsat pris.',
      },
    };
  }
}

async function writeContentFile(content: PageContent): Promise<void> {
  await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), 'utf-8');
}

export async function getPageContent(): Promise<{
  content?: PageContent;
  error?: string;
}> {
  try {
    const data = await readContentFile();
    return { content: data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updatePageContent(
  newContent: Partial<PageContent>
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentData = await readContentFile();
    const updatedData: PageContent = {
      ...currentData,
      ...newContent,
      home: newContent.home
        ? { ...currentData.home, ...newContent.home }
        : currentData.home,
      about: newContent.about
        ? { ...currentData.about, ...newContent.about }
        : currentData.about,
      gallery: newContent.gallery
        ? { ...currentData.gallery, ...newContent.gallery }
        : currentData.gallery,
      contact: newContent.contact
        ? { ...currentData.contact, ...newContent.contact }
        : currentData.contact,
      footer: newContent.footer
        ? {
            ...currentData.footer,
            ...newContent.footer,
          }
        : currentData.footer,
      exhibitions: newContent.exhibitions
        ? {
            ...currentData.exhibitions,
            ...newContent.exhibitions,
          }
        : currentData.exhibitions,
      seo: newContent.seo
        ? {
            ...currentData.seo,
            ...newContent.seo,
          }
        : currentData.seo,
    };
    await writeContentFile(updatedData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
