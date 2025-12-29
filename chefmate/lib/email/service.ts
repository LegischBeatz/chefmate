
import { Resend } from 'resend';

// Safe access to environment variable
const RESEND_API_KEY = typeof process !== 'undefined' && process.env ? process.env.RESEND_API_KEY : undefined;

// Initialize Resend only if key is present
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailPayload) => {
  if (resend) {
    try {
      const data = await resend.emails.send({
        from: 'ChefMate <onboarding@resend.dev>', // Default testing sender for Resend
        to,
        subject,
        html,
      });
      return { success: true, data, type: 'real' };
    } catch (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }
  } else {
    // Fallback Mock Logic
    // We log visually distinct messages to the console to simulate email delivery
    console.groupCollapsed(`%c[MOCK EMAIL SERVICE] Sending to ${to}`, "color: #059669; font-weight: bold; background: #ecfdf5; padding: 4px; border-radius: 4px;");
    console.log(`%cSubject:`, "font-weight: bold", subject);
    console.log(`%cHTML Content:`, "font-weight: bold");
    console.log(html);
    console.groupEnd();
    
    return { success: true, type: 'mock' };
  }
};
