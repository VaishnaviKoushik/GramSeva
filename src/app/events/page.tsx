
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
import { Badge } from '@/components/ui/badge';

// Mock data for event submissions.
const mockSubmissions = [
    { id: 1, event: 'Har Ghar Tiranga', panchayat: 'badami', imageUrl: 'https://c.ndtvimg.com/2022-08/mlo2e7f8_har-ghar-tiranga-campaign_625x300_13_August_22.jpg', panchayatName: 'Badami (Bagalkot)' },
    { id: 2, event: 'Har Ghar Tiranga', panchayat: 'badami', imageUrl: 'https://images.cnbctv18.com/wp-content/uploads/2022/07/Har-ghar-tiranga-1019x573.jpg', panchayatName: 'Badami (Bagalkot)' },
    { id: 3, event: 'Har Ghar Tiranga', panchayat: 'jamkhandi', imageUrl: 'https://static.theprint.in/wp-content/uploads/2022/08/ANI-20220813075201.jpg', panchayatName: 'Jamkhandi (Bagalkot)' },
    { id: 8, event: 'Har Ghar Tiranga', panchayat: 'gokak', imageUrl: 'https://www.thehawk.in/media-library/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8zMjM0MDIyOS9vcmlnaW4uanBnIiwiZXhwaXJlc19hdCI6MTc1NTEzODg5MX0.D6I-UEkG_i7K7o8a-m-gpvWk6q0L2PQL3S_DtKkLf70/image.jpg', panchayatName: 'Gokak (Belagavi)' },
    { id: 9, event: 'Har Ghar Tiranga', panchayat: 'athani', imageUrl: 'https://images.news18.com/ibnlive/uploads/2022/08/har-ghar-tiranga-165952674316x9.jpg', panchayatName: 'Athani (Belagavi)' },
    { id: 4, event: 'Swachh Bharat Mission', panchayat: 'athani', imageUrl: 'https://media.geeksforgeeks.org/wp-content/uploads/20230728153232/gfg-50.jpg', panchayatName: 'Athani (Belagavi)' },
    { id: 5, event: 'Swachh Bharat Mission', panchayat: 'athani', imageUrl: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202310/swachh-bharat-mission-013322428-16x9.jpg?VersionId=T.8i8n3jCgVcr2wY30m5F8z46_7mU9xP&size=690:388', panchayatName: 'Athani (Belagavi)' },
    { id: 6, event: 'Swachh Bharat Mission', panchayat: 'gokak', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR63-5-kUq-YQ-1_w-9_1B4A6A6A5A5C2B2B&s', panchayatName: 'Gokak (Belagavi)' },
    { id: 7, event: 'Plantation Drive', panchayat: 'gokak', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6-J3-J3-J3-J3-J3-J3-J3-J3-J3-J3-J&s', panchayatName: 'Gokak (Belagavi)' },
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
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary">Participate and Make Your Gram Shine</h1>
        </div>
        <div className="max-w-7xl mx-auto space-y-12">
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
                    const animationDuration = eventSubmissions.length * 5;

                    return (
                        <div key={`${eventName}-gallery`}>
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
                                                    />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white">
                                                        <Badge variant="secondary">{image.panchayatName}</Badge>
                                                    </div>
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
