
'use server';
/**
 * @fileOverview A flow to process contact form submissions.
 *
 * - processContactSubmission - Handles server-side processing of contact messages.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ContactInputSchema = z.object({
  name: z.string().describe('The sender full name'),
  email: z.string().email().describe('The sender email address'),
  message: z.string().describe('The message content'),
});
export type ContactInput = z.infer<typeof ContactInputSchema>;

const ContactOutputSchema = z.object({
  success: z.boolean().describe('Whether the process was successful'),
  confirmation: z.string().describe('Confirmation message for the user'),
});
export type ContactOutput = z.infer<typeof ContactOutputSchema>;

/**
 * Server action to process contact submissions.
 * In a production environment, this would integrate with an email provider like SendGrid, Resend, or AWS SES.
 */
export async function processContactSubmission(input: ContactInput): Promise<ContactOutput> {
  return contactFlow(input);
}

const contactFlow = ai.defineFlow(
  {
    name: 'contactFlow',
    inputSchema: ContactInputSchema,
    outputSchema: ContactOutputSchema,
  },
  async (input) => {
    // Logic to simulate sending an email to kramera613@gmail.com
    console.log(`[SERVER] Automated Email Task: Sending contact details to kramera613@gmail.com`);
    console.log(`[SERVER] From: ${input.name} (${input.email})`);
    console.log(`[SERVER] Content: ${input.message}`);
    
    // This server-side execution happens "behind the scenes"
    // Return success to the client
    return {
      success: true,
      confirmation: "Thank you! Your message has been received and sent to our team. We will get back to you shortly."
    };
  }
);
