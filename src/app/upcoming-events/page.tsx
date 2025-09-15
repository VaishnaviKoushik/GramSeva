
'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar as CalendarIcon, MapPin, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { isPast } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/translations';


const allEvents = [
    {
      id: 1,
      title: 'Plantation Drive',
      date: new Date('2024-07-15'),
      location: 'Village Community Hall',
      description: 'Join us in planting 100 new saplings to make our village greener and celebrate Independence Day.',
    },
    {
      id: 2,
      title: 'Swachh Bharat Abhiyan',
      date: new Date('2025-10-02'),
      location: 'Across the Village',
      description: 'A massive cleanliness drive to honor Mahatma Gandhi\'s birthday. Let\'s clean our streets together.',
    },
    {
      id: 3,
      title: 'Gram Sabha Meeting',
      date: new Date('2025-09-05'),
      location: 'Panchayat Office',
      description: 'An open meeting for all villagers to discuss development projects and local governance.',
    },
    {
      id: 4,
      title: 'Free Health Check-up Camp',
      date: new Date('2024-06-15'),
      location: 'Primary Health Centre',
      description: 'A free health camp for all villagers, with specialist doctors for consultation.',
    },
    {
        id: 5,
        title: 'Digital Literacy Workshop',
        date: new Date('2025-08-20'),
        location: 'Government School',
        description: 'Learn basic computer and internet skills. Open for all ages.',
    },
    {
        id: 6,
        title: 'Village Cultural Festival',
        date: new Date('2025-11-01'),
        location: 'Village Square',
        description: 'Celebrate our local culture with music, dance, and food stalls.',
    },
];

export default function UpcomingEventsPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [rsvpedEvents, setRsvpedEvents] = useState<Set<number>>(new Set());
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


  const eventDates = allEvents.map(event => event.date);

  const handleRsvp = (eventId: number) => {
    if (!user) {
        router.push('/login');
        return;
    }
    setRsvpedEvents(prev => {
        const newSet = new Set(prev);
        if (newSet.has(eventId)) {
            newSet.delete(eventId);
            toast({ title: 'RSVP Cancelled' });
        } else {
            newSet.add(eventId);
            toast({ title: '✅ RSVP Successful!', description: "We'll see you there!" });
        }
        return newSet;
    });
  };

  const filteredEvents = selectedDate
    ? allEvents.filter(event => event.date.toDateString() === selectedDate.toDateString())
    : [];

  const isSelectedDateInPast = selectedDate ? isPast(selectedDate) && selectedDate.toDateString() !== new Date().toDateString() : false;

  const RsvpButton = ({ eventId, isRsvped }: { eventId: number, isRsvped: boolean }) => {
    const button = (
        <Button 
            className="w-full"
            onClick={() => handleRsvp(eventId)}
            variant={isRsvped ? 'secondary' : 'default'}
            disabled={isSelectedDateInPast}
        >
            {isSelectedDateInPast ? 'Event Ended' : (isRsvped ? 'Cancel RSVP' : 'RSVP')}
        </Button>
    );

    return button;
  };


  return (
    <div className="bg-background min-h-screen flex flex-col">
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
                <Button variant="link" className="text-primary-foreground text-lg">
                  {language === 'en' ? 'English' : 'ಕನ್ನಡ'}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {language !== 'en' && <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>}
                {language !== 'kn' && <DropdownMenuItem onClick={() => setLanguage('kn')}>
                  ಕನ್ನಡ
                </DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
        </nav>
      </header>
      
      <main className="p-5 flex-grow">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary">Community Events</h1>
                <p className="text-muted-foreground mt-2">
                    Get involved in local initiatives. Participate, connect with your neighbors, and help build a stronger community.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="p-2">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md"
                                modifiers={{ eventDays: eventDates }}
                                modifiersStyles={{ 
                                    eventDays: { 
                                        backgroundColor: 'hsl(var(--accent))',
                                        color: 'hsl(var(--accent-foreground))',
                                        borderRadius: '0.25rem'
                                    } 
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-4">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => {
                            const isRsvped = rsvpedEvents.has(event.id);
                            return (
                                <Card key={event.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                                    <CardHeader>
                                        <CardTitle>{event.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-2">
                                        <div className="flex items-center text-muted-foreground">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            <span>{event.date.toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            <span>{event.location}</span>
                                        </div>
                                        <p className="text-muted-foreground pt-2">{event.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <RsvpButton eventId={event.id} isRsvped={isRsvped} />
                                    </CardFooter>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>No events scheduled for this day.</p>
                            <p>Select a highlighted date to see event details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </main>

       <footer className="text-center p-2.5 bg-primary text-primary-foreground mt-5">
        &copy; 2025 GramSeva. All Rights Reserved.
      </footer>
    </div>
  );
}
