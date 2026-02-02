
'use server';

import { google, type sheets_v4 } from 'googleapis';
import { getMockArtworks } from './artwork-service.mock';

// ----- DATA MODELS -----

export interface ArtworkImage {
  url: string;
  dataAiHint?: string;
}

export interface ArtworkVideo {
  url: string;
  thumbnailUrl?: string;
}

export type ArtworkType = 'painting' | 'keramik' | 'vægkunst';

export interface Artwork {
  id: string;
  name: string;
  type: ArtworkType;
  artist: 'boldsen' | 'zenia';
  dimensions: string | undefined;
  price: number;
  discount?: number;
  width?: number;
  height?: number;
  diameter?: number;
  weight?: number;
  images: ArtworkImage[];
  videos?: ArtworkVideo[];
  primaryImageIndex: number;
  status: 'available' | 'sold';
  creationDate: string;
  materials?: string;
  description?: string;
  vatRate: number;
  atGallery?: boolean;
  isSecondary?: boolean;
  dominantColor?: string;
}

// ----- NEW CALENDAR EVENT MODELS -----
export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    startDate: string;
    endDate: string;
}


// ----- CONFIGURATION -----
const BOLDSEN_SHEET_ID = '13A02EeZQ40iGU36wD0zGBd90MBQTqplKvhh6To29U1Y';
const ZENIA_SHEET_ID = '13eBPgqjhlQO84Ob-kzvbmJ9ZxP7XS0avszsVSlhfM8Y';
const ARTWORKS_SHEET_NAME = 'Artworks';
const CALENDAR_EVENTS_SHEET_NAME = 'CalendarEvents';


// ----- HELPER FUNCTIONS -----

async function getCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    } catch (error) {
      console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', error);
      return null;
    }
  }
  // In a production environment, we ONLY use environment variables.
  // The local file import has been removed to prevent build failures.
  return null;
}

let sheetsClient: sheets_v4.Sheets | null = null;

async function getSheets(): Promise<sheets_v4.Sheets> {
  if (sheetsClient) {
    return sheetsClient;
  }
  const credentials = await getCredentials();
  if (!credentials) {
    throw new Error('Google service account credentials are not configured.');
  }
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  sheetsClient = google.sheets({ version: 'v4', auth: authClient as any });
  return sheetsClient;
}

function mapRowToArtwork(row: any[], header: string[], artist: 'boldsen' | 'zenia'): Artwork {
  const artwork: any = { artist };
  header.forEach((key, index) => {
    const rawValue = row[index];
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (key === 'images' || key === 'videos') {
      try {
        let jsonString = value;
        if (typeof jsonString === 'string' && jsonString.startsWith('"') && jsonString.endsWith('"')) {
            jsonString = JSON.parse(jsonString);
        }
        artwork[key] = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString || [];
      } catch (e) {
        artwork[key] = [];
      }
    } else if (key === 'atGallery' || key === 'isSecondary') {
      artwork[key] = value === 'TRUE';
    } else if (
      [ 'price', 'primaryImageIndex', 'height', 'vatRate', 'diameter', 'weight', 'discount', 'width' ].includes(key)
    ) {
      artwork[key] = value !== undefined && value !== '' ? Number(String(value).replace(',', '.')) : undefined;
    } else if (key === 'status') {
      artwork[key] = value === 'sold' ? 'sold' : 'available';
    } else if (key === 'type') {
      artwork[key] = value === 'keramik' ? 'keramik' : value === 'vægkunst' ? 'vægkunst' : 'painting';
    } else {
      artwork[key] = value !== undefined && value !== null ? String(value) : '';
    }
  });
  
  if (!artwork.videos) artwork.videos = [];
  if (!artwork.images) artwork.images = [];
  if (!artwork.type) artwork.type = artist === 'zenia' ? 'keramik' : 'painting';
  if (artwork.atGallery === undefined) artwork.atGallery = false;
  if (artwork.isSecondary === undefined) artwork.isSecondary = false;
  if (artwork.vatRate === undefined) artwork.vatRate = artist === 'zenia' ? 25 : 5;
  if (artwork.price === undefined) artwork.price = 0;
  if (artwork.primaryImageIndex === undefined) artwork.primaryImageIndex = 0;
  if (artwork.dominantColor === undefined) artwork.dominantColor = '';


  return artwork as Artwork;
}

function mapRowToCalendarEvent(row: any[], header: string[]): CalendarEvent {
  const event: any = {};
  header.forEach((key, index) => {
    const rawValue = row[index];
    event[key] = rawValue !== undefined && rawValue !== null ? String(rawValue) : '';
  });
  return event as CalendarEvent;
}

// ----- DATA FETCHING -----

async function fetchArtworksFromSheet(sheetId: string, artist: 'boldsen' | 'zenia'): Promise<{ artworks?: Artwork[]; error?: string; }> {
    const credentials = await getCredentials();
    if (!credentials) {
        return { error: `Google credentials not configured. Cannot fetch for ${artist}.` };
    }

    try {
        const sheets = await getSheets();
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: ARTWORKS_SHEET_NAME,
        });

        const rows = res.data.values;
        if (!rows || rows.length <= 1) {
            return { artworks: [] };
        }

        const header = rows[0];
        const artworks = rows.slice(1).map(row => mapRowToArtwork(row, header, artist)).filter(art => art.id);
        
        return { artworks };
    } catch (error: any) {
        const creds = await getCredentials().catch(() => null);
        const serviceAccountEmail = (creds as any)?.client_email || 'unknown';
        console.error(`Error reading from Google Sheet for ${artist} (ID: ${sheetId}):`, error);
        return { error: `Kunne ikke indlæse værker for ${artist}. Tjek at Sheet ID er korrekt og at det er delt med service-kontoen. Service-konto email: ${serviceAccountEmail}` };
    }
}

export async function getAllArtworks(): Promise<{ artworks: Artwork[]; error?: string; }> {
  const [boldsenResult, zeniaResult] = await Promise.allSettled([
    fetchArtworksFromSheet(BOLDSEN_SHEET_ID, 'boldsen'),
    fetchArtworksFromSheet(ZENIA_SHEET_ID, 'zenia')
  ]);

  let combinedArtworks: Artwork[] = [];
  const errors: string[] = [];

  if (boldsenResult.status === 'fulfilled' && boldsenResult.value.artworks) {
    combinedArtworks.push(...boldsenResult.value.artworks);
  } else if (boldsenResult.status === 'fulfilled' && boldsenResult.value.error) {
    errors.push(boldsenResult.value.error);
  } else if (boldsenResult.status === 'rejected') {
    errors.push('Kritisk fejl ved hentning af Boldsen-værker.');
    console.error(boldsenResult.reason);
  }

  if (zeniaResult.status === 'fulfilled' && zeniaResult.value.artworks) {
    combinedArtworks.push(...zeniaResult.value.artworks);
  } else if (zeniaResult.status === 'fulfilled' && zeniaResult.value.error) {
    errors.push(zeniaResult.value.error);
  } else if (zeniaResult.status === 'rejected') {
    errors.push('Kritisk fejl ved hentning af Zenia-værker.');
     console.error(zeniaResult.reason);
  }
  
  const credentials = await getCredentials();
  if (!credentials && combinedArtworks.length === 0) {
      console.warn('Google credentials not found. Returning mock data.');
      return { artworks: getMockArtworks(), error: 'Viser midlertidige data, da Google Sheets-integrationen ikke er konfigureret.' };
  }

  return { 
    artworks: combinedArtworks.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()),
    error: errors.length > 0 ? errors.join(' \n') : undefined 
  };
}

export async function getArtworkById(id: string): Promise<{ artwork?: Artwork; error?: string }> {
    const { artworks, error } = await getAllArtworks();
    const artwork = artworks?.find(art => art.id === id);
    if (!artwork) {
        return { error: error || `Kunstværk med ID ${id} blev ikke fundet.` };
    }
    return { artwork };
}

export async function getAllCalendarEvents(): Promise<{ events: CalendarEvent[]; error?: string; }> {
    const credentials = await getCredentials();
    if (!credentials) {
        // In this case, we just return an empty array instead of mock data, 
        // as the calendar is a non-essential, additive feature.
        return { events: [], error: 'Google credentials not configured. Calendar feature is disabled.' };
    }

    try {
        const sheets = await getSheets();
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: BOLDSEN_SHEET_ID, // Storing in the main sheet for simplicity
            range: CALENDAR_EVENTS_SHEET_NAME,
        });

        const rows = res.data.values;
        if (!rows || rows.length <= 1) {
            return { events: [] };
        }

        const header = rows[0];
        const events = rows.slice(1).map(row => mapRowToCalendarEvent(row, header)).filter(event => event.id && event.title);
        
        return { events };
    } catch (error: any) {
         if (error.message && error.message.includes('Unable to parse range')) {
            // This error means the sheet doesn't exist yet. It's not a critical failure.
            console.log(`'${CALENDAR_EVENTS_SHEET_NAME}' sheet not found. Returning empty array. It will be created on the first save.`);
            return { events: [] };
        }
        const creds = await getCredentials().catch(() => null);
        const serviceAccountEmail = (creds as any)?.client_email || 'unknown';
        console.error(`Error reading calendar events from Google Sheet (ID: ${BOLDSEN_SHEET_ID}):`, error);
        return { error: `Kunne ikke indlæse kalender. Tjek at et faneblad med navnet '${CALENDAR_EVENTS_SHEET_NAME}' eksisterer, og at det er delt med service-kontoen. Service-konto email: ${serviceAccountEmail}` };
    }
}


// ----- UPDATE/WRITE FUNCTIONS (kun til Boldsens sheet indtil videre) -----

async function updateSheetValue(sheetId: string, idKey: string, idValue: string, columnKey: string, newValue: string): Promise<{ success: boolean; error?: string }> {
  const credentials = await getCredentials();
  if (!credentials) {
    console.warn("Mock Mode: Not updating sheet as no credentials are provided.");
    return { success: true }; 
  }
  
  try {
    const sheets = await getSheets();
    const range = `${ARTWORKS_SHEET_NAME}!A:Z`; 

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const rows = res.data.values;
    if (!rows || rows.length <= 1) return { error: 'Sheet is empty or has no data.' };

    const header = rows[0];
    const idColumnIndex = header.indexOf(idKey);
    const valueColumnIndex = header.indexOf(columnKey);

    if (idColumnIndex === -1 || valueColumnIndex === -1) return { error: `Could not find column '${columnKey}' in sheet.` };

    const dataRowIndex = rows.slice(1).findIndex(row => row[idColumnIndex] === idValue);
    if (dataRowIndex === -1) return { error: `Row with ID "${idValue}" not found.` };

    const sheetRowNumber = dataRowIndex + 2; 
    const sheetColumnLetter = String.fromCharCode('A'.charCodeAt(0) + valueColumnIndex);
    const updateRange = `${ARTWORKS_SHEET_NAME}!${sheetColumnLetter}${sheetRowNumber}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: updateRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[newValue]] },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating Google Sheet:', error);
    return { success: false, error: `Could not update sheet: ${error.message}` };
  }
}

export async function updateArtworkDescription(id: string, newDescription: string): Promise<{ success?: boolean; error?: string }> {
  // Logic to determine which sheet to update would be needed for a dual-artist setup.
  // For now, it defaults to the main (Boldsen) sheet as per initial requirements.
  return await updateSheetValue(BOLDSEN_SHEET_ID, 'id', id, 'description', newDescription);
}

export async function updateArtwork(id: string, data: Partial<Artwork>): Promise<{ success: boolean; error?: string }> {
    // This function will need logic to determine which artist's sheet to update.
    // For now, as a safe default for the admin panel, we'll assume it's Martin's.
    // A more advanced implementation might involve looking up the artist from the ID first.
    const { artwork } = await getArtworkById(id);
    const sheetId = artwork?.artist === 'zenia' ? ZENIA_SHEET_ID : BOLDSEN_SHEET_ID;

    try {
        const updatePromises = Object.entries(data).map(([key, value]) => {
          let sheetValue = (typeof value === 'boolean') ? (value ? 'TRUE' : 'FALSE') : (value === null || value === undefined) ? '' : String(value);
          return updateSheetValue(sheetId, 'id', id, key, sheetValue);
        });

        const results = await Promise.all(updatePromises);
        const firstError = results.find(res => res.error);

        if (firstError) return { success: false, error: firstError.error };

        return { success: true };
  } catch (error: any) {
    return { success: false, error: `Kunne ikke opdatere værket: ${error.message}` };
  }
}

// ----- NEW CALENDAR UPDATE FUNCTION -----
export async function updateCalendarEvents(events: CalendarEvent[]): Promise<{ success: boolean; error?: string }> {
  const credentials = await getCredentials();
  if (!credentials) {
    return { success: false, error: "Google credentials not configured. Cannot save events." };
  }

  const header = ["id", "title", "description", "imageUrl", "link", "startDate", "endDate"];
  const values = [header, ...events.map(event => header.map(key => event[key as keyof CalendarEvent]))];

  try {
    const sheets = await getSheets();

    // First, clear the existing sheet to remove old entries
    await sheets.spreadsheets.values.clear({
        spreadsheetId: BOLDSEN_SHEET_ID,
        range: CALENDAR_EVENTS_SHEET_NAME,
    });
    
    // Then, write the new data
    await sheets.spreadsheets.values.update({
      spreadsheetId: BOLDSEN_SHEET_ID,
      range: `${CALENDAR_EVENTS_SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    return { success: true };
  } catch (error: any) {
    const sheets = await getSheets();
    // If clearing fails because sheet doesn't exist, we try to just write.
    if (error.message && (error.message.includes('Unable to parse range') || error.message.includes('clear is not a function'))) {
         try {
             await sheets.spreadsheets.values.update({
                spreadsheetId: BOLDSEN_SHEET_ID,
                range: `${CALENDAR_EVENTS_SHEET_NAME}!A1`,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values },
                });
             return { success: true };
         } catch (writeError: any) {
             console.error('Error writing to new calendar sheet:', writeError);
             return { success: false, error: `Could not create or write to calendar sheet: ${writeError.message}` };
         }
    }
    console.error('Error updating calendar sheet:', error);
    return { success: false, error: `Could not update calendar sheet: ${error.message}` };
  }
}
