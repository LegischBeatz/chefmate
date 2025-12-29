
import { sendEmail } from '../email/service';

interface ContactState {
  success: boolean;
  message: string;
}

export const submitContactForm = async (prevState: any, formData: FormData): Promise<ContactState> => {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;
  
  // Environment check for Hybrid Logic
  // In this client-side demo, process.env.RESEND_API_KEY might be undefined, triggering the Mock path naturally.
  const hasResendKey = typeof process !== 'undefined' && process.env && !!process.env.RESEND_API_KEY;
  const supportEmail = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPPORT_EMAIL) || 'support@chefmate.ai';

  if (hasResendKey) {
    // Real Email Path
    await sendEmail({
      to: supportEmail,
      subject: `[Contact Form] ${subject} - ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #059669;">New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    });
  } else {
    // Demo Mode: Simulate Delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.groupCollapsed(`%c[MOCK CONTACT SUBMISSION]`, "color: #059669; font-weight: bold; background: #ecfdf5; padding: 4px; border-radius: 4px;");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.groupEnd();
  }

  return { success: true, message: "Message sent!" };
};
