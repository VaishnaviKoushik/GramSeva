'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying urban problems from an image.
 *
 * It takes an image data URI as input and returns the identified problem category.
 * - identifyProblemFromImage - A function that handles the problem identification process.
 * - IdentifyProblemFromImageInput - The input type for the identifyProblemFromImage function.
 * - IdentifyProblemFromImageOutput - The return type for the identifyProblemFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  output: {schema: IdentifyProblemFromImageOutputSchema},
  prompt: `You are an AI trained to identify urban problems from images.

  Analyze the image and determine the category of the problem.

  Available categories: pothole, overflowing bin, broken streetlight.

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
    return output!;
  }
);
