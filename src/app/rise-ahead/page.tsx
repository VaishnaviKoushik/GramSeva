
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { ChevronDown } from 'lucide-react';

const initiatives = [
    {
      id: 'swachh-bharat',
      title: 'Swachh Bharat Mission (Gramin)',
      description: 'A nationwide cleanliness campaign to improve sanitation and hygiene in rural areas. It aims to eliminate open defecation, manage solid waste, and promote clean living environments.',
      howToParticipate: [
        'Organize and participate in local cleanliness drives.',
        'Advocate for and help in the construction of household toilets.',
        'Spread awareness about waste segregation and management.',
        'Report areas with garbage dumps for timely action.',
      ],
      successStory: 'The village of ODF declared itself Open Defecation Free (ODF) after a community-led effort to build toilets for every household. This has significantly improved health and sanitation in the area.',
      imageUrl: PlaceHolderImages.find(p => p.id === 'event_swachh')?.imageUrl || '',
      imageHint: PlaceHolderImages.find(p => p.id === 'event_swachh')?.imageHint || '',
      link: 'https://swachhbharatmission.gov.in/sbmcms/index.htm',
    },
    {
      id: 'jal-jeevan',
      title: 'Jal Jeevan Mission',
      description: 'Aimed at providing safe and adequate drinking water through individual household tap connections to all households in rural India.',
      howToParticipate: [
        'Report leaking taps and pipelines to prevent water wastage.',
        'Participate in Gram Sabha meetings to discuss water supply issues.',
        'Conserve water at home and promote rainwater harvesting.',
        'Help monitor the quality of water supplied in your area.',
      ],
      successStory: 'In the arid region of Marathwada, the mission successfully provided tap water to over 1,000 households, ending their decades-long struggle for water.',
      imageUrl: 'https://images.cnbctv18.com/wp-content/uploads/2023/10/jal-jeevan-mission-j-j-m-1019x573.jpg',
      imageHint: 'tap water india',
      link: 'https://jaljeevanmission.gov.in/',
    },
    {
      id: 'pmgsy',
      title: 'Pradhan Mantri Gram Sadak Yojana',
      description: 'A massive rural road connectivity program to provide all-weather road access to unconnected habitations.',
      howToParticipate: [
        'Report potholes and damaged roads for timely repair.',
        'Provide feedback on the quality of newly constructed roads.',
        'Ensure that road construction does not block drainage systems.',
      ],
      successStory: 'A new all-weather road connected the remote village of Gurez in Jammu and Kashmir to the main district, boosting tourism and local economy.',
      imageUrl: 'https://static.theprint.in/wp-content/uploads/2022/12/ANI-20221207085750.jpg',
      imageHint: 'rural road india',
      link: 'https://pmgsy.nic.in/',
    },
];

export default function RiseAheadPage() {
  const { language, setLanguage } = useContext(LanguageContext);
  const t = translations[language];

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
            <Button variant="link" className="text-primary-foreground text-lg" asChild>
                <Link href="/login">{t.login}</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
                <h1 className="text-4xl font-bold text-primary">Rise Ahead with National Initiatives</h1>
                <p className="text-muted-foreground mt-2">
                    Explore government schemes designed to uplift rural India. Learn how you can contribute and benefit.
                </p>
            </div>

            <div className="space-y-12">
                {initiatives.map((initiative) => (
                    <Card key={initiative.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-6 flex flex-col justify-between">
                                <div>
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle className="text-2xl text-accent">{initiative.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <p className="text-muted-foreground mb-4">{initiative.description}</p>
                                        
                                        <h4 className="font-semibold text-lg mb-2">How to Participate:</h4>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                                            {initiative.howToParticipate.map((step, index) => (
                                                <li key={index}>{step}</li>
                                            ))}
                                        </ul>

                                        <h4 className="font-semibold text-lg mb-2">Success Story:</h4>
                                        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                            {initiative.successStory}
                                        </blockquote>
                                    </CardContent>
                                </div>
                                <CardFooter className="p-0 pt-6">
                                    <Button asChild>
                                        <a href={initiative.link} target="_blank" rel="noopener noreferrer">
                                            Learn More
                                        </a>
                                    </Button>
                                </CardFooter>
                            </div>
                            <div className="relative min-h-[300px]">
                                <Image
                                    src={initiative.imageUrl}
                                    alt={initiative.title}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={initiative.imageHint}
                                />
                            </div>
                        </div>
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
