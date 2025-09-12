'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { panchayats } from '@/lib/panchayats';

type Section = 'home' | 'events' | 'issues';

const carouselImages = PlaceHolderImages.filter(p => p.id.startsWith("carousel_"));

// Mock API functions for demonstration
const fetchProblems = async () => {
  // In a real app, this would fetch from your backend
  return [
    {
      _id: '1',
      title: 'Pothole on Main Street',
      description: 'A large pothole is causing issues for traffic.',
      aiResult: 'Identified as road damage.',
      image: 'https://picsum.photos/seed/problem1/400/300',
    },
    {
      _id: '2',
      title: 'Broken Streetlight',
      description: 'The streetlight at the corner of Oak and Pine is out.',
      aiResult: 'Identified as electrical issue.',
      image: 'https://picsum.photos/seed/problem2/400/300',
    },
  ];
};

const submitProblem = async (formData: FormData) => {
  // In a real app, this would submit to your backend
  console.log('Submitting:', Object.fromEntries(formData.entries()));
  await new Promise(res => setTimeout(res, 1000));
  return {
    message: 'Problem submitted successfully!',
    aiResult: 'Analysis complete: Identified as infrastructure damage.',
  };
};

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-lg shadow-lg h-52">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselImages.map((img, index) => (
          <div key={index} className="w-full flex-shrink-0">
             <Image
                src={img.imageUrl}
                alt={img.description}
                width={1000}
                height={200}
                className="object-cover w-full h-52"
                data-ai-hint={img.imageHint}
              />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeSection() {
  return (
    <section>
      <Carousel />
      <h2 className="text-center text-2xl mt-4">Welcome to GramSeva 🌱</h2>
      <p className="text-center text-muted-foreground">
        Connecting villages with authorities to solve problems and celebrate progress.
      </p>
    </section>
  );
}

function EventsSection() {
  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold">Events</h2>
      <p className="mt-4 text-muted-foreground">
        Upcoming village meetings, cultural festivals, and local updates will be displayed here.
      </p>
    </section>
  );
}

type Problem = {
  _id: string;
  title: string;
  description: string;
  aiResult: string;
  image?: string;
};

function IssuesSection() {
  const { toast } = useToast();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const loadProblems = async () => {
      const fetchedProblems = await fetchProblems();
      setProblems(fetchedProblems);
    };
    loadProblems();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const data = await submitProblem(formData);
      toast({
        title: '✅ Success',
        description: `${data.message}\nAI Analysis:\n${data.aiResult}`
      });
      formRef.current?.reset();
      const fetchedProblems = await fetchProblems();
      setProblems(fetchedProblems);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: 'Error submitting problem!'
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Report a Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <Input name="title" placeholder="Problem Title" required />
              <Textarea name="description" placeholder="Describe the issue" required />
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
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-center mb-4">Reported Problems</h2>
        <div className="space-y-4">
          {problems.map((p) => (
            <Card key={p._id}>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-accent">{p.title}</h3>
                <p><strong>Description:</strong> {p.description}</p>
                <p><strong>AI Analysis:</strong> {p.aiResult}</p>
                {p.image && (
                   <div className="mt-2">
                     <Image
                      src={p.image}
                      alt="Problem Image"
                      width={400}
                      height={300}
                      className="rounded-md"
                    />
                   </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'events':
        return <EventsSection />;
      case 'issues':
        return <IssuesSection />;
      default:
        return <HomeSection />;
    }
  };
  
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground flex justify-between items-center p-4 px-10">
        <h1 className="text-2xl font-bold">GramSeva</h1>
        <nav className="flex items-center space-x-4">
          <Button variant="link" className="text-primary-foreground text-base" onClick={() => setActiveSection('home')}>Home</Button>
          <Button variant="link" className="text-primary-foreground text-base" onClick={() => setActiveSection('events')}>Events</Button>
          <Button variant="link" className="text-primary-foreground text-base" onClick={() => setActiveSection('issues')}>Issues</Button>
          <Button variant="link" className="text-primary-foreground text-base" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </header>

      <main className="p-5">
        {renderSection()}
      </main>

      <footer className="text-center p-2.5 bg-primary text-primary-foreground mt-5">
        &copy; 2025 GramSeva. All Rights Reserved.
      </footer>
    </div>
  );
}
