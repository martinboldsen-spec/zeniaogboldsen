
"use server";

import { z } from "zod";
import { updateArtwork, type Artwork } from "@/lib/artwork-service";
import { updatePageContent, type GalleryPageContent, type ExhibitionsPageContent, type SeoPageContent, type HomePageContent, type PromoCarouselSlide, getPageContent, type FooterPageContent, type AboutPageContent, type ContactPageContent, IndividualContactInfo } from "@/lib/page-content-service";
import { revalidatePath } from "next/cache";
import { sendContactEmail } from "@/lib/email";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { username, password } = Object.fromEntries(formData.entries());
    
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      const session = await getIronSession(cookies(), sessionOptions);
      session.isLoggedIn = true;
      await session.save();
    } else {
        return 'Brugernavn eller adgangskode er forkert.';
    }
  } catch (error) {
    if ((error as Error).message.includes('credentialssignin')) {
      return 'Brugernavn eller adgangskode er forkert.';
    }
    console.error(error);
    return 'Der opstod en fejl. Prøv igen.';
  }

  redirect('/admin');
}

export async function logout() {
    'use server'
    const session = await getIronSession(cookies(), sessionOptions);
    session.destroy();
    redirect('/login');
}


const contactSchema = z.object({
  name: z.string().min(2, "Navn skal være mindst 2 tegn."),
  email: z.string().email("Ugyldig email-adresse."),
  message: z.string().min(10, "Besked skal være mindst 10 tegn."),
  artwork: z.string().optional(),
  subject: z.string().optional(),
  from_cart: z.string().optional(),
});

type FormState = {
  message: string | null;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  success?: boolean;
}

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    artwork: formData.get("artwork") || undefined,
    subject: formData.get("subject") || undefined,
    from_cart: formData.get("from_cart") || undefined,
  };

  const validatedFields = contactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Udfyld venligst alle felter korrekt.",
      success: false,
    };
  }

  try {
    await sendContactEmail(validatedFields.data);
    
    // Check if the submission is from the cart
    if(validatedFields.data.from_cart) {
        return { message: "Tak for din besked! Din forespørgsel er sendt og din kurv er nu tømt.", success: true };
    }

    return { message: "Tak for din besked! Jeg vender tilbage hurtigst muligt.", success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      message: "Der opstod en fejl under afsendelse af din besked. Prøv venligst igen.",
      errors: {},
      success: false
    };
  }
}

export async function updateArtworkAction(prevState: any, formData: FormData): Promise<{message: string; errors?: boolean}> {
    const id = formData.get("id") as string;
    if (!id) {
        return { message: "Mangler ID for kunstværk.", errors: true };
    }

    const dataToUpdate: Partial<Artwork> = {
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        discount: formData.get('discount') ? Number(formData.get('discount')) : 0, 
        status: formData.get('status') as 'available' | 'sold',
        atGallery: formData.get('atGallery') === 'on',
        isSecondary: formData.get('isSecondary') === 'on'
    };

    const { success, error } = await updateArtwork(id, dataToUpdate);

    if (error) {
        return { message: `Fejl: ${error}`, errors: true };
    }

    // Revalidate paths to show the updated data
    revalidatePath(`/admin/edit/${id}`);
    revalidatePath(`/admin/artworks`);
    revalidatePath(`/artwork/${id}`);
    revalidatePath('/');
    revalidatePath('/galleri');
    revalidatePath('/lagersalg');

    return { message: "Værket er blevet opdateret." };
}


const aboutPageSchema = z.object({
    title: z.string(),
    boldsen_image_url: z.string().url("Ugyldig URL til Martin Boldsen billede."),
    boldsen_content: z.string(),
    zenia_image_url: z.string().url("Ugyldig URL til Anja Zenia billede."),
    zenia_content: z.string(),
    boldsen_website_url: z.string().url("Ugyldig URL for Boldsen hjemmeside").or(z.literal('')).optional(),
    zenia_website_url: z.string().url("Ugyldig URL for Zenia hjemmeside").or(z.literal('')).optional(),
});

export async function updateAboutPageAction(prevState: any, formData: FormData) {
  const validatedFields = aboutPageSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Data er ugyldig.",
    };
  }

  const { success, error } = await updatePageContent({ about: validatedFields.data as AboutPageContent });

  if (!success) {
    return { message: `Fejl: ${error}` };
  }

  revalidatePath('/about');
  revalidatePath('/admin/edit-content/about');
  
  return { message: "Siden 'Om Os' er blevet opdateret." };
}

function parseDynamicFormData(formData: FormData, topLevelKeys: string[], listKeys: { listName: string, itemKeys: string[], primaryKey: string, maxItems: number }[]) {
    const rawData = Object.fromEntries(formData.entries());
    const dataToValidate: { [key: string]: any } = {};

    topLevelKeys.forEach(key => {
        dataToValidate[key] = rawData[key];
    });

    listKeys.forEach(({ listName, itemKeys, primaryKey, maxItems }) => {
        const items = [];
        for (let i = 0; i < maxItems; i++) {
            const item: { [key: string]: any } = {};
            let hasValue = false;
            
            itemKeys.forEach(key => {
                const formKey = `${listName}.${i}.${key}`;
                const value = rawData[formKey] as string;
                if (value) {
                    item[key] = value;
                    hasValue = true;
                }
            });
            // Only add the item if its primary key (e.g., name, title, or url) has a value.
            if (hasValue && item[primaryKey]) {
                items.push(item);
            }
        }
        dataToValidate[listName] = items;
    });
    
    return dataToValidate;
}

export async function updateHomePageAction(prevState: any, formData: FormData) {
  const dataToValidate = parseDynamicFormData(
    formData,
    ['home_hero_title', 'home_hero_subtitle', 'home_hero_image_url', 'home_intro_title', 'home_intro_content', 'home_intro_signature', 'home_intro_image_url'],
    [
      { listName: 'promo_carousel_slides', itemKeys: ['title', 'description', 'media_url', 'media_type', 'button_text', 'button_link'], primaryKey: 'title', maxItems: 4 }
    ]
  );
  
  dataToValidate.promo_carousel_active = formData.get('promo_carousel_active') === 'on';

  // Quick validation for URLs
  if (dataToValidate.home_hero_image_url && !dataToValidate.home_hero_image_url.startsWith('http')) return { message: "Hero billede URL er ugyldig." };
  if (dataToValidate.home_intro_image_url && !dataToValidate.home_intro_image_url.startsWith('http')) return { message: "Intro billede URL er ugyldig." };


  const { success, error } = await updatePageContent({ home: dataToValidate as HomePageContent });
  
  if (!success) {
    return { message: `Fejl: ${error}` };
  }

  revalidatePath('/');
  revalidatePath('/admin/edit-content/home');
  
  return { message: "Forsiden er blevet opdateret." };
}

const individualContactSchema = z.object({
    email: z.string().email("Ugyldig email."),
    phone: z.string(),
    cvr: z.string(),
});

const contactPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  address: z.string(),
  boldsen: individualContactSchema,
  zenia: individualContactSchema
});

export async function updateContactPageAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    
    const dataToValidate = {
        title: rawData.title,
        description: rawData.description,
        address: rawData.address,
        boldsen: {
            email: rawData.boldsen_email,
            phone: rawData.boldsen_phone,
            cvr: rawData.boldsen_cvr
        },
        zenia: {
            email: rawData.zenia_email,
            phone: rawData.zenia_phone,
            cvr: rawData.zenia_cvr
        }
    };

  const validatedFields = contactPageSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Data er ugyldig.",
    };
  }

  const { success, error } = await updatePageContent({ contact: validatedFields.data as ContactPageContent });
  
  if (!success) {
    return { message: `Fejl: ${error}` };
  }

  revalidatePath('/contact');
  revalidatePath('/admin/edit-content/contact');
  
  return { message: "Kontaktsiden er blevet opdateret." };
}

export async function updateFooterPageAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    const socialLinks = [];
    for (let i = 0; i < 4; i++) {
        const platform = rawData[`social_links.${i}.platform`] as FooterSocialLink['platform'];
        const url = rawData[`social_links.${i}.url`] as string;
        if (platform && url) {
            socialLinks.push({ platform, url });
        }
    }

    const dataToValidate: FooterPageContent = {
        copyright: rawData.copyright as string,
        social_links: socialLinks
    }
  
    const { success, error } = await updatePageContent({ footer: dataToValidate });
  
    if (!success) {
      return { message: `Fejl: ${error}` };
    }
  
    revalidatePath('/', 'layout'); // Revalidate root to update footer everywhere
    revalidatePath('/admin/edit-content/footer');
    
    return { message: "Footer er blevet opdateret." };
}

export async function updateExhibitionsPageAction(prevState: any, formData: FormData): Promise<{message: string}> {
    const dataToValidate = parseDynamicFormData(
        formData,
        ['title', 'description', 'gallery_title'],
        [
            { listName: 'partners', itemKeys: ['name', 'image_url', 'website', 'description', 'address', 'email', 'phone'], primaryKey: 'name', maxItems: 4 },
            { listName: 'gallery_images', itemKeys: ['url', 'date', 'caption'], primaryKey: 'url', maxItems: 12 }
        ]
    );

    const { success, error } = await updatePageContent({ exhibitions: dataToValidate as ExhibitionsPageContent });

    if (!success) {
        return { message: `Fejl: ${error}` };
    }

    revalidatePath('/udstillinger');
    revalidatePath('/admin/edit-content/exhibitions');
    
    return { message: "Siden 'Udstillinger' er blevet opdateret." };
}

export async function updateSeoPageAction(prevState: any, formData: FormData): Promise<{message: string}> {
    const rawData = Object.fromEntries(formData.entries());
    const keywords = (rawData.keywords as string).split(',').map(k => k.trim()).filter(Boolean);

    const dataToValidate: Partial<SeoPageContent> = {
        defaultTitle: rawData.defaultTitle as string,
        titleTemplate: rawData.titleTemplate as string,
        description: rawData.description as string,
        keywords: keywords,
        googleAnalyticsId: rawData.googleAnalyticsId as string,
        headerScript: rawData.headerScript as string,
        ogImageUrl: rawData.ogImageUrl as string,
    }

    const { content: currentContent, error: readError } = await getPageContent();
    if(readError || !currentContent) {
      return { message: `Fejl ved læsning af eksisterende indstillinger: ${readError}` };
    }

    const updatedSeoContent: SeoPageContent = {
      ...currentContent.seo,
      ...dataToValidate
    }

    const { success, error } = await updatePageContent({ seo: updatedSeoContent });
    
    if (!success) {
        return { message: `Fejl: ${error}` };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/edit-content/seo');
    
    return { message: "SEO & Indstillinger er blevet opdateret." };
}

export async function updateLagersalgPageAction(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  const { content: currentContent, error: readError } = await getPageContent();
  if (readError || !currentContent) {
    return { message: `Fejl ved læsning af eksisterende indstillinger: ${readError}`, errors: true };
  }

  const updatedSeoContent: SeoPageContent = {
    ...currentContent.seo,
    secondaryGalleryActive: rawData.secondaryGalleryActive === 'on',
    secondaryGalleryName: rawData.secondaryGalleryName as string,
    secondaryGalleryTitle: rawData.secondaryGalleryTitle as string,
    secondaryGalleryDescription: rawData.secondaryGalleryDescription as string,
  };

  const { success, error } = await updatePageContent({ seo: updatedSeoContent });

  if (!success) {
    return { message: `Fejl: ${error}`, errors: true };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/lagersalg');
  revalidatePath('/admin/edit-content/lagersalg');
  
  return { message: "Lagersalg indstillinger er blevet opdateret." };
}

const galleryPageSchema = z.object({
    title: z.string(),
    description: z.string(),
});

export async function updateGalleryPageAction(prevState: any, formData: FormData) {
  const validatedFields = galleryPageSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Data er ugyldig.",
    };
  }

  const { success, error } = await updatePageContent({ gallery: validatedFields.data });

  if (!success) {
    return { message: `Fejl: ${error}` };
  }

  revalidatePath('/galleri');
  revalidatePath('/admin/edit-content/gallery');
  
  return { message: "Gallerisiden er blevet opdateret." };
}

    
