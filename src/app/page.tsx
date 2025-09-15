
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { panchayats } from '@/lib/panchayats';
import { identifyProblemFromImage } from '@/ai/flows/identify-problem-from-image';
import { fileToDataUri } from '@/lib/utils';
import { draftReportForPanchayat } from '@/ai/flows/draft-report-for-panchayat';
import { ReportWizard } from '@/components/report-wizard';
import { CheckCircle, Users, BarChart, ChevronDown, Eye, Calendar, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type ProblemStatus } from '@/components/ui/status-tracker';
import { Badge } from '@/components/ui/badge';

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

const upcomingEvents = [
    {
      id: 1,
      title: 'Plantation Drive',
      date: 'July 15, 2024',
      location: 'Village Community Hall',
      description: 'Join us in planting 100 new saplings to make our village greener.',
    },
    {
      id: 2,
      title: 'Swachh Bharat Abhiyan',
      date: 'October 2, 2025',
      location: 'Across the Village',
      description: 'A massive cleanliness drive to honor Mahatma Gandhi\'s birthday. Let\'s clean our streets together.',
    },
    {
      id: 3,
      title: 'Gram Sabha Meeting',
      date: 'September 5, 2025',
      location: 'Panchayat Office',
      description: 'An open meeting for all villagers to discuss development projects and local governance.',
    },
     {
      id: 4,
      title: 'Free Health Check-up Camp',
      date: 'June 15, 2024',
      location: 'Primary Health Centre',
      description: 'A free health camp for all villagers, with specialist doctors for consultation.',
    },
];

type Problem = {
  _id: string;
  title: string;
  description: string;
  aiResult: string;
  suggestedMeasures: string;
  imageUrl: string;
  status: ProblemStatus;
};

const initialProblems: Problem[] = [
    {
      _id: '1',
      title: 'Pothole on Main Street',
      description: 'A large pothole is causing issues for traffic near the market area. It becomes dangerous after rainfall.',
      aiResult: 'Identified as road damage.',
      suggestedMeasures: 'Barricade the area and inform the local PWD for road surface repair.',
      imageUrl: 'https://picsum.photos/seed/problem1/400/300',
      status: 'Under Review',
    },
    {
      _id: '2',
      title: 'Broken Streetlight',
      description: 'The streetlight at the corner of Oak and Pine is out, making the area very dark and unsafe at night.',
      aiResult: 'Identified as electrical issue.',
      suggestedMeasures: 'Report to the electricity board and cordon off the area if there are exposed wires.',
      imageUrl: 'https://picsum.photos/seed/problem2/400/300',
      status: 'Resolved',
    },
    {
      _id: '3',
      title: 'Overflowing Garbage Bin',
      description: 'The main garbage bin near the bus stop has not been cleared for over a week and is overflowing.',
      aiResult: 'Identified as sanitation issue.',
      suggestedMeasures: 'Arrange for immediate garbage collection and consider placing an additional bin.',
      imageUrl: 'https://picsum.photos/seed/problem3/400/300',
      status: 'Assigned',
    },
];

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
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Empowering Our Villages, Together</h1>
          <p className="text-lg mb-8">Your voice can bring the change. Report local issues and help build a better community.</p>
      </div>
    </div>
  );
}

function HomeSection({ onIssuesClick, problems }: { onIssuesClick: (issueId?: string) => void, problems: Problem[] }) {
  const latestIssues = problems.slice(0, 3);

  const getStatusVariant = (status: ProblemStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'Resolved':
            return 'default';
        case 'Assigned':
        case 'Under Review':
            return 'secondary';
        case 'Submitted':
            return 'outline';
        default:
            return 'outline';
    }
  };

  return (
    <section>
      <Carousel />
      
      <div className="mt-16">
        <h2 className="text-center text-3xl font-bold text-primary mb-4">Latest Issues Reported</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8">
          See the latest issues reported by vigilant members of the community. Your participation makes a difference.
        </p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestIssues.map((issue) => (
            <Card key={issue._id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{issue.title}</CardTitle>
                  <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{issue.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => onIssuesClick(issue._id)}>
                  <Eye className="mr-2" /> View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

       <div className="mt-16">
        <h2 className="text-center text-3xl font-bold text-primary mb-4">Upcoming Community Events</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8">
          Get involved in local initiatives. Participate, connect with your neighbors, and help build a stronger community.
        </p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.slice(0, 3).map((event) => (
            <Card key={event.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{event.date}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                </div>
                <p className="text-muted-foreground pt-2">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                    <Link href="/events">Join Event</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16">
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
        <div className="text-center mt-8">
            <Button asChild>
                <Link href="/rise-ahead">Learn More</Link>
            </Button>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">How GramSeva Empowers You</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          GramSeva helps you connect with your local village authorities to solve problems and build a better community together. Here's how you can make a difference:
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <Card className="text-center">
              <CardHeader>
                  <CheckCircle className="mx-auto h-12 w-12 text-accent" />
                  <CardTitle className="mt-4">Report Local Issues</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>See a pothole or a broken streetlight? Snap a photo, add details, and report it directly to your Panchayat in minutes.</p>
              </CardContent>
          </Card>
          <Card className="text-center">
              <CardHeader>
                  <Users className="mx-auto h-12 w-12 text-accent" />
                  <CardTitle className="mt-4">Join Community Events</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>Participate in local events, cleanliness drives, and community initiatives. Together, we can make our villages shine.</p>
              </CardContent>
          </Card>
          <Card className="text-center">
              <CardHeader>
                  <BarChart className="mx-auto h-12 w-12 text-accent" />
                  <CardTitle className="mt-4">See The Impact</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>View success stories and impact reports from other villages. Get inspired by the positive changes happening all around.</p>
              </CardContent>
          </Card>
      </div>

      <div className="mt-12 max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold">Real Change, Real Stories</h3>
        <p className="text-muted-foreground mt-2">
            "Thanks to GramSeva, the overflowing garbage bin in our area was cleared within two days of reporting. It's amazing to see such quick action!" <br />- A villager from Badami, Bagalkot
        </p>
      </div>
    </section>
  );
}

const problemTitles = [
  'Pothole',
  'Overflowing Bin',
  'Broken Streetlight',
  'Garbage Dump',
  'Water Logging',
  'Damaged Public Property',
  'Other',
];


function IssuesSection({setProblems}: {setProblems: React.Dispatch<React.SetStateAction<Problem[]>>}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const panchayatId = formData.get('panchayat') as string;
    const panchayat = panchayats.find(p => p.id === panchayatId);
    
    if (!imageFile || !panchayat || !title) {
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

      setLoadingMessage('Identifying problem and suggesting measures...');
      const { problemCategory, suggestedMeasures } = await identifyProblemFromImage({ photoDataUri });

      const newProblem: Problem = {
        _id: new Date().toISOString(),
        title,
        description,
        imageUrl: photoDataUri,
        aiResult: `AI Identified as: ${problemCategory}`,
        suggestedMeasures,
        status: 'Submitted',
      };

      setProblems(prevProblems => [newProblem, ...prevProblems]);
      
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
        title: '✅ Report Submitted & Drafted',
        description: 'The problem has been logged. Your email client is opening to send the report.'
      });
      
      formRef.current?.reset();
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
          <Card className="h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
            <CardHeader>
              <CardTitle>Report a Problem</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                 <Select name="title" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Problem Title" />
                  </SelectTrigger>
                  <SelectContent>
                    {problemTitles.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
           <Card className="h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <CardTitle>Let AI help you</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                  <ReportWizard />
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [problems, setProblems] = useState<Problem[]>(initialProblems);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection onIssuesClick={handleIssuesClick} problems={problems} />;
      case 'issues':
        return <IssuesSection setProblems={setProblems} />;
      default:
        return <HomeSection onIssuesClick={handleIssuesClick} problems={problems} />;
    }
  };

  const handleIssuesClick = (issueId?: string) => {
    setActiveSection('issues');
    setTimeout(() => {
        const targetId = issueId ? `issue-${issueId}` : 'issues-section';
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 0);
  };
  
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground flex justify-between items-center p-4 px-10 border-b">
        <Link href="/" className="text-3xl font-bold text-primary-foreground">GramSeva</Link>
        <nav className="flex items-center space-x-4">
          <Button variant="link" className="text-primary-foreground text-lg" onClick={() => setActiveSection('home')}>Home</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="text-primary-foreground text-lg">
                Events
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/events">All Events</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/upcoming-events">Upcoming Events</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/feedbacks">Feedbacks</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                  <Link href="/rise-ahead">Rise Ahead</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="link" className="text-primary-foreground text-lg">
                    Issues
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                    <div onClick={() => handleIssuesClick()}>Report a New Issue</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reported-issues">Reported Issues</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          <Button variant="link" className="text-primary-foreground text-lg" asChild>
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
