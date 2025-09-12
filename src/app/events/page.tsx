
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { panchayats } from '@/lib/panchayats';
import { fileToDataUri } from '@/lib/utils';
import { groupBy } from 'lodash';

// Mock data for event submissions. In a real app, this would come from a database.
const mockSubmissions = [
    { id: 1, panchayat: 'badami', imageUrl: 'https://picsum.photos/seed/e1/400/300', panchayatName: 'Badami (Bagalkot)' },
    { id: 2, panchayat: 'badami', imageUrl: 'https://picsum.photos/seed/e2/400/300', panchayatName: 'Badami (Bagalkot)' },
    { id: 3, panchayat: 'jamkhandi', imageUrl: 'https://picsum.photos/seed/e3/400/300', panchayatName: 'Jamkhandi (Bagalkot)' },
    { id: 4, panchayat: 'athani', imageUrl: 'https://picsum.photos/seed/e4/400/300', panchayatName: 'Athani (Belagavi)' },
    { id: 5, panchayat: 'athani', imageUrl: 'https://picsum.photos/seed/e5/400/300', panchayatName: 'Athani (Belagavi)' },
    { id: 6, panchayat: 'athani', imageUrl: 'https://picsum.photos/seed/e6/400/300', panchayatName: 'Athani (Belagavi)' },
];

type Submission = {
    id: number;
    panchayat: string;
    imageUrl: string;
    panchayatName: string;
};

export default function EventsPage() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('image') as File;
    const panchayatId = formData.get('panchayat') as string;
    const panchayat = panchayats.find(p => p.id === panchayatId);

    if (!imageFile || !panchayat) {
      toast({
        variant: 'destructive',
        title: '❌ Incomplete Submission',
        description: 'Please select your Panchayat and upload an image.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const photoDataUri = await fileToDataUri(imageFile);
      
      // In a real app, you would save this data to your backend.
      // For this prototype, we'll just add it to our local state.
      const newSubmission: Submission = {
        id: submissions.length + 1,
        panchayat: panchayat.id,
        panchayatName: panchayat.name,
        imageUrl: photoDataUri,
      };
      
      setSubmissions(prev => [newSubmission, ...prev]);

      toast({
        title: '✅ Submission Successful!',
        description: "Thank you for participating in 'Har Ghar Tiranga'!",
      });

      formRef.current?.reset();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: '❌ Upload Failed',
        description: 'There was an error processing your image.',
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const submissionsByPanchayat = groupBy(submissions, 'panchayatName');

  return (
    <div className="bg-background min-h-screen">
       <header className="bg-primary text-primary-foreground flex justify-between items-center p-4 px-10">
        <Link href="/" className="text-2xl font-bold">GramSeva</Link>
        <nav className="flex items-center space-x-4">
            <Button variant="link" className="text-primary-foreground text-base" asChild>
                <Link href="/">Home</Link>
            </Button>
            <Button variant="link" className="text-primary-foreground text-base" asChild>
                <Link href="/events">Events</Link>
            </Button>
            <Button variant="link" className="text-primary-foreground text-base" asChild>
                <Link href="/#issues">Issues</Link>
            </Button>
            <Button variant="link" className="text-primary-foreground text-base" asChild>
                <Link href="/login">Login</Link>
            </Button>
        </nav>
      </header>
      
      <main className="p-5">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary">Har Ghar Tiranga 🇮🇳</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Showcase your village's patriotic spirit! Upload photos of flag displays from your Panchayat.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Entry</CardTitle>
              <CardDescription>Select your Panchayat and upload a photo of a flag display.</CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <Select name="panchayat" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Panchayat" />
                  </SelectTrigger>
                  <SelectContent>
                    {panchayats.map((panchayat) => (
                      <SelectItem key={panchayat.id} value={panchayat.id}>
                        {panchayat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="file" name="image" accept="image/*" required />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Uploading...' : 'Upload Photo'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Village Galleries</h2>
          <div className="space-y-10">
            {Object.entries(submissionsByPanchayat).map(([panchayatName, images]) => (
              <div key={panchayatName}>
                <h3 className="text-2xl font-semibold text-accent mb-4">{panchayatName}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map(image => (
                    <div key={image.id} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                      <Image 
                        src={image.imageUrl}
                        alt={`Har Ghar Tiranga submission from ${panchayatName}`}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

       <footer className="text-center p-2.5 bg-primary text-primary-foreground mt-5">
        &copy; 2025 GramSeva. All Rights Reserved.
      </footer>
    </div>
  );
}
