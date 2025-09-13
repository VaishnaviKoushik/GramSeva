
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusTracker, type ProblemStatus } from '@/components/ui/status-tracker';

type Problem = {
  _id: string;
  title: string;
  description: string;
  aiResult: string;
  suggestedMeasures: string;
  imageUrl: string;
  status: ProblemStatus;
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
    {
        _id: '4',
        title: 'Water Logging near School',
        description: 'Heavy rains have caused water logging on the road leading to the primary school, making it difficult for children to pass.',
        aiResult: 'Identified as drainage issue.',
        suggestedMeasures: 'Clear any blocked drains and create temporary channels for water to flow away. Report to municipal authorities for a permanent solution.',
        imageUrl: 'https://picsum.photos/seed/problem4/400/300',
        status: 'Submitted',
    },
];

export default function ReportedIssuesPage() {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);

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
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary">All Reported Issues</h1>
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
                    </CardContent>
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
