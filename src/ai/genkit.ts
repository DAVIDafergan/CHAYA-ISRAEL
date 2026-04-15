import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Singleton Genkit instance to prevent multiple listeners and memory leaks.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
