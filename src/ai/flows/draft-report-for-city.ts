'use server';
/**
 * @fileOverview This file defines the Genkit flow for drafting a report to the city's public works department.
 *
 * - draftReportForCity - A function that takes location data, a photo, and problem category and returns a report.
 * - DraftReportForCityInput - The input type for the draftReportForCity function.
 * - DraftReportForCityOutput - The return type for the draftReportForCity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftReportForCityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the urban problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  locationData: z.string().describe('The pinpoint location data of the problem.'),
  problemCategory: z.string().describe('The identified category of the urban problem.'),
});
export type DraftReportForCityInput = z.infer<typeof DraftReportForCityInputSchema>;

const DraftReportForCityOutputSchema = z.object({
  report: z.string().describe('The drafted report to the city.'),
});
export type DraftReportForCityOutput = z.infer<typeof DraftReportForCityOutputSchema>;

export async function draftReportForCity(input: DraftReportForCityInput): Promise<DraftReportForCityOutput> {
  return draftReportForCityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftReportForCityPrompt',
  input: {schema: DraftReportForCityInputSchema},
  output: {schema: DraftReportForCityOutputSchema},
  prompt: `You are an AI assistant specialized in drafting reports for urban issues to the city's public works department.

  Given the following information, draft a concise and professional report:

  Problem Category: {{{problemCategory}}}
  Location Data: {{{locationData}}}
  Photo: {{media url=photoDataUri}}

  Report:`,
});

const draftReportForCityFlow = ai.defineFlow(
  {
    name: 'draftReportForCityFlow',
    inputSchema: DraftReportForCityInputSchema,
    outputSchema: DraftReportForCityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
