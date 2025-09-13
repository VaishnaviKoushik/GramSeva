
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { panchayats } from '@/lib/panchayats';
import { identifyProblemFromImage } from '@/ai/flows/identify-problem-from-image';
import { fileToDataUri } from '@/lib/utils';
import { draftReportForPanchayat } from '@/ai/flows/draft-report-for-panchayat';
import { ReportWizard } from '@/components/report-wizard';

type Section = 'home' | 'issues';

const carouselImages = PlaceHolderImages.filter(p => p.id.startsWith("carousel_"));

const governmentEvents = [
  {
    id: 1,
    title: 'Swachh Bharat Mission (Gramin)',
    description: 'Participate in the nation-wide cleanliness drive. Top performing villages get recognized at the national level.',
    link: 'https://swachhbharatmission.gov.in/sbmcms/index.htm',
  },
  {
    id: 2,
    title: 'National Water Mission',
    description: 'Contribute to water conservation efforts. Individuals and Panchayats are awarded for innovative practices.',
    link: 'http://nwm.gov.in/',
  },
  {
    id: 3,
    title: 'Sansad Adarsh Gram Yojana',
    description: 'Collaborate with your Member of Parliament to transform your village into a model village and get recognized for it.',
    link: 'https://saanjhi.gov.in/',
  },
];


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

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-lg shadow-lg h-[400px]">
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
                height={400}
                className="object-cover w-full h-[400px]"
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
      
      <div className="mt-8">
        <h2 className="text-center text-3xl font-bold text-primary mb-4">Rise Ahead</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8">
          Explore national initiatives and schemes designed to empower and uplift rural communities. Participate, contribute, and be a part of India's growth story.
        </p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {governmentEvents.map((event) => (
            <a href={event.link} key={event.id} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-center text-2xl">Welcome to GramSeva 🌱</h2>
        <p className="text-center text-muted-foreground">
          Connecting villages with authorities to solve problems and celebrate progress.
        </p>
      </div>
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
  const [loadingMessage, setLoadingMessage] = useState('');
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
    const imageFile = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const panchayatId = formData.get('panchayat') as string;
    const panchayat = panchayats.find(p => p.id === panchayatId);
    
    if (!imageFile || !panchayat) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: 'Please fill all fields and select a Panchayat.'
      });
      setIsLoading(false);
      return;
    }

    try {
      setLoadingMessage('Processing image...');
      const photoDataUri = await fileToDataUri(imageFile);

      setLoadingMessage('Identifying problem category...');
      const { problemCategory } = await identifyProblemFromImage({ photoDataUri });

      setLoadingMessage('Drafting report for Panchayat...');
      const { report } = await draftReportForPanchayat({
        photoDataUri,
        problemCategory,
        problemDescription: description,
        panchayatName: panchayat.name
      });
      
      const panchayatEmail = `${panchayat.id.replace(/\s/g, '.')}@example.com`; // Placeholder email
      const mailtoLink = `mailto:${panchayatEmail}?subject=${encodeURIComponent(
        `Problem Report: ${title}`
      )}&body=${encodeURIComponent(report)}`;

      window.location.href = mailtoLink;
      
      toast({
        title: '✅ Report Drafted',
        description: 'Your email client is opening to send the report.'
      });
      
      formRef.current?.reset();
      const fetchedProblems = await fetchProblems(); // Refresh list
      setProblems(fetchedProblems);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: 'An error occurred while processing your report.'
      });
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <section id="issues-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div>
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? loadingMessage : 'Submit'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div>
           <Card>
              <CardHeader>
                <CardTitle>Let AI help you</CardTitle>
              </CardHeader>
              <CardContent>
                  <ReportWizard />
              </CardContent>
            </Card>
        </div>
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
      case 'issues':
        return <IssuesSection />;
      default:
        return <HomeSection />;
    }
  };

  const handleIssuesClick = () => {
    setActiveSection('issues');
    setTimeout(() => {
      const issuesSection = document.getElementById('issues-section');
      if (issuesSection) {
        issuesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };
  
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-white text-black flex justify-between items-center p-4 px-10 border-b">
        <h1 className="text-3xl font-bold text-black">GramSeva</h1>
        <nav className="flex items-center space-x-4">
          <Button variant="link" className="text-black text-lg" onClick={() => setActiveSection('home')}>Home</Button>
          <Button variant="link" className="text-black text-lg" asChild>
            <Link href="/events">Events</Link>
          </Button>
          <Button variant="link" className="text-black text-lg" onClick={handleIssuesClick}>Issues</Button>
          <Button variant="link" className="text-black text-lg" asChild>
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
