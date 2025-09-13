'use server';
/**
 * @fileOverview This file defines the Genkit flow for suggesting measures for a given problem category.
 *
 * - suggestMeasures - A function that takes a problem category and returns suggested measures.
 * - SuggestMeasuresInput - The input type for the suggestMeasures function.
 * - SuggestMeasuresOutput - The return type for the suggestMeasures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMeasuresInputSchema = z.object({
  problemCategory: z.string().describe('The identified category of the urban problem.'),
});
export type SuggestMeasuresInput = z.infer<typeof SuggestMeasuresInputSchema>;

const SuggestMeasuresOutputSchema = z.object({
  measures: z.string().describe('The suggested measures to resolve the problem.'),
});
export type SuggestMeasuresOutput = z.infer<typeof SuggestMeasuresOutputSchema>;

export async function suggestMeasures(input: SuggestMeasuresInput): Promise<SuggestMeasuresOutput> {
  return suggestMeasuresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMeasuresPrompt',
  input: {schema: SuggestMeasuresInputSchema},
  output: {schema: SuggestMeasuresOutputSchema},
  prompt: `You are an AI assistant for rural development. Given a problem category, provide 1-2 brief, actionable suggestions for immediate measures.

  Problem Category: {{{problemCategory}}}
  
  Suggested Measures:`,
});

const suggestMeasuresFlow = ai.defineFlow(
  {
    name: 'suggestMeasuresFlow',
    inputSchema: SuggestMeasuresInputSchema,
    outputSchema: SuggestMeasuresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
