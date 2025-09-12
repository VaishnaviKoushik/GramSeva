'use server';
/**
 * @fileOverview This file defines the Genkit flow for drafting a report to a Panchayat.
 *
 * - draftReportForPanchayat - A function that takes problem details and returns a report.
 * - DraftReportForPanchayatInput - The input type for the draftReportForPanchayat function.
 * - DraftReportForPanchayatOutput - The return type for the draftReportForPanchayat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftReportForPanchayatInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the urban problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  problemCategory: z.string().describe('The identified category of the urban problem.'),
  problemDescription: z.string().describe('A description of the problem provided by the user.'),
  panchayatName: z.string().describe('The name of the Panchayat where the problem is located.'),
});
export type DraftReportForPanchayatInput = z.infer<typeof DraftReportForPanchayatInputSchema>;

const DraftReportForPanchayatOutputSchema = z.object({
  report: z.string().describe('The drafted report for the Panchayat.'),
});
export type DraftReportForPanchayatOutput = z.infer<typeof DraftReportForPanchayatOutputSchema>;

export async function draftReportForPanchayat(input: DraftReportForPanchayatInput): Promise<DraftReportForPanchayatOutput> {
  return draftReportForPanchayatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftReportForPanchayatPrompt',
  input: {schema: DraftReportForPanchayatInputSchema},
  output: {schema: DraftReportForPanchayatOutputSchema},
  prompt: `You are an AI assistant for citizens to report local issues to their Panchayat.

  Draft a formal yet clear report to the head of the Panchayat based on the following information. The report should be respectful and provide all necessary details for them to take action.

  Panchayat Name: {{{panchayatName}}}
  Problem Category: {{{problemCategory}}}
  Description by Citizen: {{{problemDescription}}}
  
  Photo of the issue: {{media url=photoDataUri}}

  Structure the report with a clear subject line, a formal salutation, a body explaining the problem and its location (implicitly the Panchayat area), and a respectful closing. The tone should be that of a concerned citizen.`,
});

const draftReportForPanchayatFlow = ai.defineFlow(
  {
    name: 'draftReportForPanchayatFlow',
    inputSchema: DraftReportForPanchayatInputSchema,
    outputSchema: DraftReportForPanchayatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
