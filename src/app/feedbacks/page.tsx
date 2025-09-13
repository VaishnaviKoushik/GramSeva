
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';

export default function FeedbacksPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would handle the form submission here.
    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for your valuable feedback!',
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-white text-black flex justify-between items-center p-4 px-10 border-b">
        <Link href="/" className="text-3xl font-bold text-black">GramSeva</Link>
        <nav className="flex items-center space-x-4">
            <Button variant="link" className="text-black text-lg" asChild>
                <Link href="/">Home</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="text-black text-lg">
                  Events
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/events">All Events</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/feedbacks">Feedbacks</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="link" className="text-black text-lg" asChild>
                <Link href="/#issues">Issues</Link>
            </Button>
            <Button variant="link" className="text-black text-lg" asChild>
                <Link href="/login">Login</Link>
            </Button>
        </nav>
      </header>
      
      <main className="p-5 flex-grow flex justify-center items-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Submit Your Feedback</CardTitle>
            <CardDescription>We value your opinion. Let us know how we can improve GramSeva.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" placeholder="Your Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea id="feedback" name="feedback" placeholder="Your feedback..." required />
              </div>
              <Button type="submit" className="w-full">Submit Feedback</Button>
            </form>
          </CardContent>
        </Card>
      </main>

       <footer className="text-center p-2.5 bg-primary text-primary-foreground">
        &copy; 2025 GramSeva. All Rights Reserved.
      </footer>
    </div>
  );
}
