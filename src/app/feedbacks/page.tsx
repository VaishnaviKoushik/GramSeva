
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { useState, useEffect, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/translations';

const successStories = [
    {
      id: 1,
      title: 'Pothole on Main Street Fixed!',
      village: 'Badami, Bagalkot',
      story: 'The large pothole near the market that we reported last week has been completely repaired! Travel is so much smoother and safer now. Thank you, GramSeva!',
      imageUrl: 'https://picsum.photos/seed/success1/400/250',
      imageHint: 'repaired road',
    },
    {
      id: 2,
      title: 'Streetlight Finally Working',
      village: 'Anekal, Bangalore Urban',
      story: 'The streetlight at the corner of Oak and Pine is now working after weeks of being out. The area feels much safer for everyone at night. It’s great to see such quick action.',
      imageUrl: 'https://picsum.photos/seed/success2/400/250',
      imageHint: 'working streetlight',
    },
    {
      id: 3,
      title: 'Clean Bus Stop Area',
      village: 'Hoskote, Bangalore Rural',
      story: 'The overflowing garbage bin near the bus stop has been cleared, and the area is clean again. It makes such a big difference for daily commuters.',
      imageUrl: 'https://picsum.photos/seed/success3/400/250',
      imageHint: 'clean street',
    },
];

export default function FeedbacksPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<{ email: string } | null>(null);
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
                <h1 className="text-4xl font-bold text-primary">Success Stories from Our Villages</h1>
                <p className="text-muted-foreground mt-2">
                    Real change, driven by real people. See the impact of your participation.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {successStories.map((story) => (
                    <Card key={story.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <CardHeader>
                            <div className="relative aspect-[16/9] w-full">
                                <Image
                                    src={story.imageUrl}
                                    alt={story.title}
                                    fill
                                    className="rounded-t-lg object-cover"
                                    data-ai-hint={story.imageHint}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                            <CardDescription className="font-semibold text-primary">{story.village}</CardDescription>
                            <p className="text-muted-foreground mt-2">{story.story}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center items-center">
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
            </div>
        </div>
      </main>

       <footer className="text-center p-2.5 bg-primary text-primary-foreground mt-5">
        &copy; 2025 GramSeva. All Rights Reserved.
      </footer>
    </div>
  );
}
