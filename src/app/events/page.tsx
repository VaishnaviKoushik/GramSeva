
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

// Mock data for event submissions.
const mockSubmissions = [
    { id: 1, event: 'Har Ghar Tiranga', panchayat: 'badami', imageUrl: 'https://picsum.photos/seed/e1/400/300', panchayatName: 'Badami (Bagalkot)' },
    { id: 2, event: 'Har Ghar Tiranga', panchayat: 'badami', imageUrl: 'https://picsum.photos/seed/e2/400/300', panchayatName: 'Badami (Bagalkot)' },
    { id: 3, event: 'Har Ghar Tiranga', panchayat: 'jamkhandi', imageUrl: 'https://picsum.photos/seed/e3/400/300', panchayatName: 'Jamkhandi (Bagalkot)' },
    { id: 4, event: 'Swachh Bharat Mission', panchayat: 'athani', imageUrl: 'https://picsum.photos/seed/e4/400/300', panchayatName: 'Athani (Belagavi)' },
    { id: 5, event: 'Swachh Bharat Mission', panchayat: 'athani', imageUrl: 'https://picsum.photos/seed/e5/400/300', panchayatName: 'Athani (Belagavi)' },
    { id: 6, event: 'Swachh Bharat Mission', panchayat: 'gokak', imageUrl: 'https://picsum.photos/seed/e6/400/300', panchayatName: 'Gokak (Belagavi)' },
    { id: 7, event: 'Plantation Drive', panchayat: 'gokak', imageUrl: 'https://picsum.photos/seed/e7/400/300', panchayatName: 'Gokak (Belagavi)' },
];

const availableEvents = ['Har Ghar Tiranga', 'Swachh Bharat Mission', 'Plantation Drive'];


type Submission = {
    id: number;
    event: string;
    panchayat: string;
    imageUrl: string;
    panchayatName: string;
};

export default function EventsPage() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [isLoading, setIsLoading] = useState(false);
  const [formVisibleForEvent, setFormVisibleForEvent] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('image') as File;
    const panchayatId = formData.get('panchayat') as string;
    const eventName = formData.get('event') as string;
    const panchayat = panchayats.find(p => p.id === panchayatId);

    if (!imageFile || !panchayat || !eventName) {
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
      
      const newSubmission: Submission = {
        id: submissions.length + 1,
        event: eventName,
        panchayat: panchayat.id,
        panchayatName: panchayat.name,
        imageUrl: photoDataUri,
      };
      
      setSubmissions(prev => [newSubmission, ...prev]);

      toast({
        title: '✅ Submission Successful!',
        description: "Thank you for participating!",
      });

      formRef.current?.reset();
      setFormVisibleForEvent(null);
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

  const submissionsByEvent = groupBy(submissions, 'event');

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
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary">Participate and Make Your Gram Shine</h1>
        </div>
        <div className="max-w-4xl mx-auto space-y-12">
            {availableEvents.map((eventName) => (
                <div key={eventName}>
                    <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-foreground">{eventName}</h2>
                            <Button onClick={() => setFormVisibleForEvent(formVisibleForEvent === eventName ? null : eventName)}>
                            {formVisibleForEvent === eventName ? 'Close' : 'Join'}
                            </Button>
                    </div>
                    
                    {formVisibleForEvent === eventName && (
                        <div className="max-w-2xl mx-auto mb-12">
                            <Card>
                            <CardHeader>
                                <CardTitle>Submit Your Entry for {eventName}</CardTitle>
                                <CardDescription>Select your Panchayat and upload a photo to participate.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                                <input type="hidden" name="event" value={eventName} />
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
                    )}
                </div>
            ))}

            <div className="mt-16 space-y-12">
                {availableEvents.map((eventName) => {
                    const eventSubmissions = submissionsByEvent[eventName] || [];
                    if (eventSubmissions.length === 0) return null;

                    return (
                        <div key={`${eventName}-gallery`}>
                            <h2 className="text-3xl font-bold text-foreground mb-6">{eventName} Submissions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {eventSubmissions.map(image => (
                                <div key={image.id} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <Image 
                                    src={image.imageUrl}
                                    alt={`Event submission from ${image.panchayatName}`}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover"
                                    />
                                </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
      </main>

       <footer className="text-center p-2.5 bg-primary text-primary-foreground mt-5">
        &copy; 2025 GramSeva. All Rights Reserved.
      </footer>
    </div>
  );
}
