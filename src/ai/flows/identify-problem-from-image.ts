'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying urban problems from an image.
 *
 * It takes an image data URI as input and returns the identified problem category and suggested measures.
 * - identifyProblemFromImage - A function that handles the problem identification process.
 * - IdentifyProblemFromImageInput - The input type for the identifyProblemFromImage function.
 * - IdentifyProblemFromImageOutput - The return type for the identifyProblemFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { suggestMeasures } from './suggest-measures-flow';

const IdentifyProblemFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of an urban problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type IdentifyProblemFromImageInput = z.infer<typeof IdentifyProblemFromImageInputSchema>;

const IdentifyProblemFromImageOutputSchema = z.object({
  problemCategory: z.string().describe('The identified category of the urban problem.'),
  suggestedMeasures: z.string().describe('The suggested measures to resolve the problem.'),
});
export type IdentifyProblemFromImageOutput = z.infer<typeof IdentifyProblemFromImageOutputSchema>;

export async function identifyProblemFromImage(
  input: IdentifyProblemFromImageInput
): Promise<IdentifyProblemFromImageOutput> {
  return identifyProblemFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyProblemFromImagePrompt',
  input: {schema: IdentifyProblemFromImageInputSchema},
  output: {schema: z.object({ problemCategory: z.string().describe('The identified category of the urban problem.') })},
  prompt: `You are an AI trained to identify problems in a village from images.

  Analyze the image and determine the category of the problem.

  Available categories: pothole, overflowing bin, broken streetlight, garbage dump, water logging, damaged public property.

  Return only the identified problem category, nothing else.

  Image: {{media url=photoDataUri}}`,
});

const identifyProblemFromImageFlow = ai.defineFlow(
  {
    name: 'identifyProblemFromImageFlow',
    inputSchema: IdentifyProblemFromImageInputSchema,
    outputSchema: IdentifyProblemFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Could not identify the problem from the image.');
    }
    const { problemCategory } = output;
    
    const { measures } = await suggestMeasures({ problemCategory });

    return {
      problemCategory,
      suggestedMeasures: measures,
    };
  }
);
