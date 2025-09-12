# **App Name**: Civic Lens

## Core Features:

- Image Upload: Allow users to upload photos of urban problems.
- Problem Identification: Use a generative AI tool to analyze the image and identify the type of urban problem (e.g., pothole, broken streetlight).
- Location Pinpointing: Integrate with a mapping API to automatically pinpoint the location of the reported problem.
- Report Drafting: Use a generative AI tool to automatically draft a report to the city's public works department, including the photo and location data.
- Report Submission: Submit the drafted report (including image and location) to the city's public works department's email using configured SMTP server settings.
- UI display of problem categories: Allow the user to overwrite or confirm the image category the AI generated using radio buttons.

## Style Guidelines:

- Primary color: Sky Blue (#87CEEB) to evoke trust, openness, and civic engagement.
- Background color: Light Gray (#F0F0F0) for a clean, accessible interface.
- Accent color: Forest Green (#228B22) to highlight calls to action and indicate successful submissions.
- Body and headline font: 'PT Sans', a humanist sans-serif for a modern and accessible look.
- Use clear, simple icons from a public domain set (e.g. Google Material Icons) to represent problem categories.
- Use a card-based layout for report submissions, making it easy to review and manage reports.
- Use a simple loading animation while the AI model processes the image, giving the user feedback while they wait.