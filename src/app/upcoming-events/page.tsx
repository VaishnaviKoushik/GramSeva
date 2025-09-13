
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const upcomingEvents = [
    {
      id: 1,
      title: 'Plantation Drive',
      date: 'August 15, 2025',
      location: 'Village Community Hall',
      description: 'Join us in planting 100 new saplings to make our village greener and celebrate Independence Day.',
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
];

export default function UpcomingEventsPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-primary text-primary-foreground flex justify-between items-center p-4 px-10 border-b">
        <Link href="/" className="text-3xl font-bold text-primary-foreground">GramSeva</Link>
        <nav className="flex items-center space-x-4">
            <Button variant="link" className="text-primary-foreground text-lg" asChild>
                <Link href="/">Home</Link>
            </Button>
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
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="link" className="text-primary-foreground text-lg">
                    Issues
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                    <Link href="/#issues-section">Report a New Issue</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link href="/#issues-section">View All Issues</Link>
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
      
      <main className="p-5 flex-grow">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary">Upcoming Community Events</h1>
                <p className="text-muted-foreground mt-2">
                    Get involved in local initiatives. Participate, connect with your neighbors, and help build a stronger community.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
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
      </main>

       <footer className="text-center p-2.5 bg-primary text-primary-foreground mt-5">
        &copy; 2025 GramSeva. All Rights Reserved.
      </footer>
    </div>
  );
}
