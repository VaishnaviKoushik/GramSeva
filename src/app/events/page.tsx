
'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { panchayats } from '@/lib/panchayats';
import { fileToDataUri } from '@/lib/utils';
import { groupBy } from 'lodash';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/translations';

// Mock data for event submissions. In a real app, this would be fetched from a database.
const mockSubmissions: Submission[] = [];

const availableEvents = ['Har Ghar Tiranga', 'Swachh Bharat Mission', 'Plantation Drive'];

const carouselImages = [
    {
        src: "https://sevalaya.org/wp-content/uploads/2023/04/waste-management-2-scaled.jpg",
        alt: "Community event for waste management",
        "data-ai-hint": "waste management community"
    },
    {
        src: "https://sevalaya.org/wp-content/uploads/2023/04/DSC08239-scaled.jpg",
        alt: "Rural development initiative",
        "data-ai-hint": "rural development"
    },
    {
        src: "https://sevalaya.org/wp-content/uploads/2025/08/Sevalaya-Kasuva_Independence-Day_1.jpg",
        alt: "Independence Day celebration",
        "data-ai-hint": "independence day celebration"
    }
];

type Submission = {
    id: number;
    event: string;
    panchayat: string;
    imageUrl: string;
    panchayatName: string;
    imageHint?: string;
};

const leaderboardData = [
  { rank: 1, panchayat: 'Badami (Bagalkot)', score: 1250, badge: 'Gold' },
  { rank: 2, panchayat: 'Anekal (Bangalore Urban)', score: 1100, badge: 'Silver' },
  { rank: 3, panchayat: 'Hoskote (Bangalore Rural)', score: 950, badge: 'Bronze' },
  { rank: 4, panchayat: 'Jamkhandi (Bagalkot)', score: 800 },
  { rank: 5, panchayat: 'Kakati (Belagavi)', score: 750 },
];

const chartData = leaderboardData.map(item => ({ name: item.panchayat, value: item.score }));
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const chartConfig = {
  score: {
    label: "Score",
  },
  ...Object.fromEntries(
    chartData.map((item, index) => [item.name, { label: item.name, color: COLORS[index % COLORS.length] }])
  ),
}

function EventsCarousel() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full mb-12"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {carouselImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full h-96">
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover rounded-lg"
                    data-ai-hint={image['data-ai-hint']}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white rounded-lg">
                    <h1 className="text-4xl font-bold mb-4">Participate and Make Your Gram Shine</h1>
                </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default function EventsPage() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [isLoading, setIsLoading] = useState(false);
  const [formVisibleForEvent, setFormVisibleForEvent] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const { language, setLanguage } = useContext(LanguageContext);
  const t = translations[language];

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

     if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to submit an event entry.',
        action: <Button onClick={() => router.push('/login')}>Login</Button>,
      });
      return;
    }

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
       <header className="bg-primary text-primary-foreground flex justify-between items-center p-4 px-10 border-b">
        <Link href="/" className="text-3xl font-bold text-primary-foreground">GramSeva</Link>
        <nav className="flex items-center space-x-4">
            <Button variant="link" className="text-primary-foreground text-lg" asChild>
                <Link href="/">{t.home}</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="text-primary-foreground text-lg">
                  {t.events}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/events">{t.allEvents}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/upcoming-events">{t.upcomingEvents}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/feedbacks">{t.feedbacks}</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/rise-ahead">{t.riseAhead}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="link" className="text-primary-foreground text-lg">
                    {t.issues}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                    <Link href="/#issues-section">{t.reportNewIssue}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reported-issues">{t.reportedIssues}</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
              <Button variant="link" className="text-primary-foreground text-lg" onClick={handleLogout}>
                {t.logout}
              </Button>
            ) : (
              <Button variant="link" className="text-primary-foreground text-lg" asChild>
                <Link href="/login">{t.login}</Link>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Globe className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('kn')}>
                  ಕನ್ನಡ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </nav>
      </header>
      
      <main className="p-5">
        <EventsCarousel />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Panchayats</CardTitle>
                        <CardDescription>Leaderboard based on event participation and community engagement.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Panchayat</TableHead>
                                <TableHead>Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaderboardData.map((item) => (
                                <TableRow key={item.rank}>
                                    <TableCell className="font-medium">{item.rank}</TableCell>
                                    <TableCell>
                                        {item.panchayat}
                                        {item.badge && <Badge variant="secondary" className="ml-2">{item.badge}</Badge>}
                                    </TableCell>
                                    <TableCell>{item.score}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Leaderboard Distribution</CardTitle>
                        <CardDescription>Visual representation of the top panchayat scores.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    labelLine={false}
                                >
                                    {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 text-center">
            <Button asChild size="lg">
                <Link href="/upcoming-events">Join an Event</Link>
            </Button>
        </div>

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
      </main>

       <footer className="text-center p-2.5 bg-primary text-primary-foreground mt-5">
        &copy; 2025 GramSeva. All Rights Reserved.
      </footer>
    </div>
  );
}
