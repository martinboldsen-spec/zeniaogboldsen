import fs from 'fs/promises';
import path from 'path';
import artPrintsData from './art-prints.json';

export interface ArtPrintFrameOption {
  id: 'plain' | 'black_frame' | 'oak_frame';
  url: string;
  description: string;
  price: number;
}

export interface ArtPrintGalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface ArtPrint {
  id: string;
  name: string;
  size: string;
  description: string;
  images: ArtPrint[]; // Legacy - no longer used but kept for type safety with old data
  frameOptions: ArtPrintFrameOption[];
  galleryImages: ArtPrintGalleryImage[];
}

const contentFilePath = path.resolve(process.cwd(), 'src/lib/art-prints.json');


export function getAllArtPrints(): ArtPrint[] {
  return artPrintsData.artPrints;
}

export function getArtPrintById(id: string): ArtPrint | undefined {
  return artPrintsData.artPrints.find(p => p.id === id);
}

export async function updateArtPrints(prints: ArtPrint[]): Promise<{ success: boolean; error?: string }> {
  try {
    const currentData = { artPrints: prints };
    await fs.writeFile(contentFilePath, JSON.stringify(currentData, null, 2), 'utf-8');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
