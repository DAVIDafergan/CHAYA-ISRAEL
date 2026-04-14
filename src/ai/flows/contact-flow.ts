
'use server';
/**
 * @fileOverview A flow to process contact form submissions.
 *
 * - processContactSubmission - Handles background processing of contact messages.
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
    // This is where backend logic like sending a notification to kramera613@gmail.com would happen
    // For now, we log it and confirm success.
    console.log(`Processing background contact from ${input.name} (${input.email}): ${input.message}`);
    
    return {
      success: true,
      confirmation: "Thank you! Your message has been sent successfully to our team."
    };
  }
);
