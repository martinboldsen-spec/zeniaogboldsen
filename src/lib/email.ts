import { Resend } from 'resend';
import { ContactFormEmail } from '@/components/email/ContactFormEmail';
import type { ReactElement } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

// You must verify your sender email address in Resend.
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'; 
// This is the email you want to receive the contact form submissions.
const toEmail = process.env.TO_EMAIL || 'martin_boldsen@hotmail.com';


interface ContactFormData {
    name: string;
    email: string;
    message: string;
    artwork?: string;
    subject?: string;
}

export async function sendContactEmail(data: ContactFormData) {
    const { name, email, message, artwork, subject } = data;

    const emailSubject = artwork 
        ? `Forespørgsel på værket: "${artwork}"`
        : subject 
        ? `Henvendelse vedrørende: "${subject}"`
        : 'Ny besked fra din hjemmeside';

    try {
        const result = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            reply_to: email,
            subject: emailSubject,
            react: ContactFormEmail({ name, email, message, artwork, subject }) as ReactElement,
        });

        if (result.error) {
            console.error('Resend error:', result.error);
            throw new Error(`Email could not be sent: ${result.error.message}`);
        }
        
        return result.data;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}
