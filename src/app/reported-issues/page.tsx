
'use client';

import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusTracker, type ProblemStatus } from '@/components/ui/status-tracker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/star-rating';
import { Calendar, MessageSquare, Star, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/translations';

type Comment = {
  user: string;
  avatar: string;
  text: string;
  date: string;
};

type Problem = {
  _id: string;
  title: string;
  description: string;
  aiResult: string;
  suggestedMeasures: string;
  imageUrl: string;
  status: ProblemStatus;
  scheduledStartDate?: string;
  scheduledCompletionDate?: string;
  comments: Comment[];
  rating?: number;
};

// In a real app, this data would be fetched from a database.
const initialProblems: Problem[] = [
    {
      _id: '1',
      title: 'Pothole on Main Street',
      description: 'A large pothole is causing issues for traffic near the market area. It becomes dangerous after rainfall.',
      aiResult: 'Identified as road damage.',
      suggestedMeasures: 'Barricade the area and inform the local PWD for road surface repair.',
      imageUrl: 'https://picsum.photos/seed/problem1/400/300',
      status: 'Under Review',
      scheduledStartDate: 'August 25, 2025',
      scheduledCompletionDate: 'August 28, 2025',
      comments: [],
    },
    {
      _id: '2',
      title: 'Broken Streetlight',
      description: 'The streetlight at the corner of Oak and Pine is out, making the area very dark and unsafe at night.',
      aiResult: 'Identified as electrical issue.',
      suggestedMeasures: 'Report to the electricity board and cordon off the area if there are exposed wires.',
      imageUrl: 'https://picsum.photos/seed/problem2/400/300',
      status: 'Resolved',
      comments: [
        { user: 'Rina S.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', text: 'Thank you for the quick fix! The street feels much safer now.', date: 'July 15, 2025' },
        { user: 'Amit K.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', text: 'Great work by the Panchayat team.', date: 'July 16, 2025' },
      ],
      rating: 4.5,
    },
    {
      _id: '3',
      title: 'Overflowing Garbage Bin',
      description: 'The main garbage bin near the bus stop has not been cleared for over a week and is overflowing.',
      aiResult: 'Identified as sanitation issue.',
      suggestedMeasures: 'Arrange for immediate garbage collection and consider placing an additional bin.',
      imageUrl: 'https://picsum.photos/seed/problem3/400/300',
      status: 'Assigned',
      scheduledStartDate: 'August 22, 2025',
      comments: [],
    },
    {
        _id: '4',
        title: 'Water Logging near School',
        description: 'Heavy rains have caused water logging on the road leading to the primary school, making it difficult for children to pass.',
        aiResult: 'Identified as drainage issue.',
        suggestedMeasures: 'Clear any blocked drains and create temporary channels for water to flow away. Report to municipal authorities for a permanent solution.',
        imageUrl: 'https://picsum.photos/seed/problem4/400/300',
        status: 'Submitted',
        comments: [],
    },
];

export default function ReportedIssuesPage() {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [user, setUser] = useState<{ email: string; type: string } | null>(null);
  const { toast } = useToast();
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
    router.push('/');
  };


  const handleFeedbackSubmit = (problemId: string, comment: string, rating: number) => {
    setProblems(prevProblems => prevProblems.map(p => {
        if (p._id === problemId) {
            const newComment: Comment = {
                user: 'You',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
                text: comment,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            };
            const existingComments = p.comments || [];
            const existingRating = p.rating || 0;
            const newTotalRatings = existingComments.length + 1;
            const newAverageRating = ((existingRating * existingComments.length) + rating) / newTotalRatings;

            return {
                ...p,
                comments: [...existingComments, newComment],
                rating: newAverageRating,
            };
        }
        return p;
    }));
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
              <>
                {user.type === 'panchayat' && (
                  <Button variant="link" className="text-primary-foreground text-lg" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                )}
                <Button variant="link" className="text-primary-foreground text-lg" onClick={handleLogout}>
                  {t.logout}
                </Button>
              </>
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
      
      <main className="p-5 flex-grow">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary">{t.allReportedIssues}</h1>
                <p className="text-muted-foreground mt-2">
                    A comprehensive list of all issues reported by the community.
                </p>
            </div>

            <div className="space-y-6">
            {problems.map((p) => (
                <Card key={p._id} id={`issue-${p._id}`} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="text-2xl text-accent">{p.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p><strong>Description:</strong> {p.description}</p>
                        <p><strong>AI Analysis:</strong> {p.aiResult}</p>
                        <p><strong>Suggested Measures:</strong> {p.suggestedMeasures}</p>
                        {p.imageUrl && (
                        <div className="mt-2">
                            <Image
                                src={p.imageUrl}
                                alt="Problem Image"
                                width={400}
                                height={300}
                                className="rounded-md"
                            />
                        </div>
                        )}
                        <div>
                        <h4 className="font-semibold mb-2">Current Status:</h4>
                        <StatusTracker currentStatus={p.status} />
                        </div>
                        {(p.scheduledStartDate || p.scheduledCompletionDate) && (
                           <div className="space-y-2 mt-4 pt-4 border-t">
                                <h4 className="font-semibold">Schedule</h4>
                                {p.scheduledStartDate && <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> <strong>Scheduled Start:</strong> {p.scheduledStartDate}</p>}
                                {p.scheduledCompletionDate && <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> <strong>Expected Completion:</strong> {p.scheduledCompletionDate}</p>}
                           </div>
                        )}
                    </CardContent>

                    {p.status === 'Resolved' && (
                        <CardFooter className="flex-col items-start">
                            <Separator className="my-4" />
                            <div className="w-full">
                                <h4 className="font-semibold text-lg flex items-center mb-2">
                                    <MessageSquare className="mr-2 h-5 w-5" /> Community Feedback
                                </h4>
                                {p.rating && (
                                    <div className="flex items-center mb-4">
                                        <StarRating rating={p.rating} totalStars={5} />
                                        <span className="ml-2 text-muted-foreground">({p.rating.toFixed(1)} average rating)</span>
                                    </div>
                                )}
                                <div className="space-y-4 mb-4">
                                    {p.comments.map((comment, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <Avatar>
                                                <AvatarImage src={comment.avatar} />
                                                <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{comment.user} <span className="text-xs text-muted-foreground ml-2">{comment.date}</span></p>
                                                <p className="text-sm">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <FeedbackForm problemId={p._id} onSubmit={handleFeedbackSubmit} />
                            </div>
                        </CardFooter>
                    )}
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

function FeedbackForm({ problemId, onSubmit }: { problemId: string, onSubmit: (problemId: string, comment: string, rating: number) => void }) {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment && rating > 0) {
            onSubmit(problemId, comment, rating);
            setComment('');
            setRating(0);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t w-full">
            <h5 className="font-semibold mb-2">Leave your feedback</h5>
            <div className="flex items-center space-x-2 mb-2">
                <StarRating rating={rating} setRating={setRating} totalStars={5} interactive />
            </div>
            <Textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the resolution..."
                className="mb-2"
                required
            />
            <Button type="submit">Submit Feedback</Button>
        </form>
    );
}
