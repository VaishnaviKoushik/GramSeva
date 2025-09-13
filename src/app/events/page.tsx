
'use client';

import { useState, useRef, useEffect } from 'react';
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

// Mock data for event submissions. In a real app, this would be fetched from a database.
const mockSubmissions: Submission[] = [];

const availableEvents = ['Har Ghar Tiranga', 'Swachh Bharat Mission', 'Plantation Drive'];

type Submission = {
    id: number;
    event: string;
    panchayat: string;
    imageUrl: string;
    panchayatName: string;
    imageHint?: string;
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
        id: mockSubmissions.length + 1,
        event: eventName,
        panchayat: panchayat.id,
        panchayatName: panchayat.name,
        imageUrl: photoDataUri,
      };
      
      mockSubmissions.unshift(newSubmission);
      setSubmissions([...mockSubmissions]);

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
       <header className="bg-white text-black flex justify-between items-center p-4 px-10 border-b">
        <Link href="/" className="text-3xl font-bold text-black">GramSeva</Link>
        <nav className="flex items-center space-x-4">
            <Button variant="link" className="text-black text-lg" asChild>
                <Link href="/">Home</Link>
            </Button>
            <Button variant="link" className="text-black text-lg" asChild>
                <Link href="/events">Events</Link>
            </Button>
            <Button variant="link" className="text-black text-lg" asChild>
                <Link href="/#issues">Issues</Link>
            </Button>
            <Button variant="link" className="text-black text-lg" asChild>
                <Link href="/login">Login</Link>
            </Button>
        </nav>
      </header>
      
      <main className="p-5">
        <div className="relative w-full h-96 mb-12">
            <Image
                src="https://sevalaya.org/wp-content/uploads/2023/04/waste-management-2-scaled.jpg"
                alt="Community event"
                fill
                className="object-cover rounded-lg"
                data-ai-hint="waste management community"
            />
        </div>
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary">Participate and Make Your Gram Shine</h1>
        </div>
        <div className="max-w-7xl mx-auto space-y-4">
            {availableEvents.map((eventName) => (
                <div key={eventName} className="p-4 rounded-lg transition-colors border border-transparent hover:bg-muted/50 hover:border-black">
                    <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground">{eventName}</h2>
                            <Button onClick={() => setFormVisibleForEvent(formVisibleForEvent === eventName ? null : eventName)}>
                            {formVisibleForEvent === eventName ? 'Close' : 'Join'}
                            </Button>
                    </div>
                    
                    {formVisibleForEvent === eventName && (
                        <div className="max-w-2xl mx-auto mt-6 mb-4">
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
                    const animationDuration = eventSubmissions.length * 5;

                    return (
                        <div key={`${eventName}-gallery`}>
                            <h2 className="text-2xl font-bold text-center mb-4">{eventName}</h2>
                            <div className="panorama-slider" style={{'--duration': `${animationDuration}s`} as React.CSSProperties}>
                                <div className="panorama-track">
                                    {[...eventSubmissions, ...eventSubmissions].map((image, index) => (
                                        <div key={`${image.id}-${index}`} className="panorama-item">
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-2 relative">
                                                    <Image 
                                                        src={image.imageUrl}
                                                        alt={`Event submission from ${image.panchayatName}`}
                                                        fill
                                                        className="object-cover rounded-lg"
                                                        data-ai-hint={image.imageHint}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
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
