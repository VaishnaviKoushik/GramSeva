'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import {
  Car,
  Trash2,
  LightbulbOff,
  UploadCloud,
  Loader2,
  MapPin,
  ClipboardCopy,
  Mail,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { draftReportForCity } from '@/ai/flows/draft-report-for-city';
import { identifyProblemFromImage } from '@/ai/flows/identify-problem-from-image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn, fileToDataUri } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Step = 'upload' | 'confirm' | 'result';
type LocationInfo = { latitude: number; longitude: number } | null;

const problemCategories = [
  { id: 'pothole', label: 'Pothole', Icon: Car },
  { id: 'overflowing bin', label: 'Overflowing Bin', Icon: Trash2 },
  { id: 'broken streetlight', label: 'Broken Streetlight', Icon: LightbulbOff },
];

export function ReportWizard() {
  const [step, setStep] = useState<Step>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [aiProblemCategory, setAiProblemCategory] = useState<string | null>(
    null
  );
  const [userProblemCategory, setUserProblemCategory] = useState('');
  const [location, setLocation] = useState<LocationInfo>(null);
  const [draftedReport, setDraftedReport] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetState = () => {
    setStep('upload');
    setImageFile(null);
    setImageDataUri(null);
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
    setAiProblemCategory(null);
    setUserProblemCategory('');
    setLocation(null);
    setDraftedReport('');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setImageFile(file);
      try {
        const uri = await fileToDataUri(file);
        setImageDataUri(uri);
      } catch (err) {
        setError('Could not read the image file. Please try another one.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not read the image file.',
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!imageDataUri) return;

    setIsLoading(true);
    setError(null);

    try {
      setLoadingMessage('Getting your location...');
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      setLoadingMessage('Analyzing image with AI...');
      const { problemCategory } = await identifyProblemFromImage({
        photoDataUri: imageDataUri,
      });
      const normalizedCategory = problemCategory.toLowerCase();
      
      const isValidCategory = problemCategories.some(p => p.id === normalizedCategory);

      if (isValidCategory) {
        setAiProblemCategory(normalizedCategory);
        setUserProblemCategory(normalizedCategory);
      } else {
        // Handle cases where AI returns an unexpected category
        setAiProblemCategory('unknown');
        setUserProblemCategory(problemCategories[0].id); // Default to the first option
      }
      
      setStep('confirm');
    } catch (err) {
      console.error(err);
      let errorMessage = 'An unexpected error occurred.';
      if (err instanceof GeolocationPositionError) {
        errorMessage = `Could not get location: ${err.message}. Please ensure location services are enabled.`;
      } else if (err instanceof Error) {
        errorMessage = `Analysis failed: ${err.message}`;
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftReport = async () => {
    if (!imageDataUri || !userProblemCategory || !location) return;

    setIsLoading(true);
    setLoadingMessage('Drafting report with AI...');
    setError(null);
    try {
      const locationData = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
      const { report } = await draftReportForCity({
        photoDataUri: imageDataUri,
        problemCategory: userProblemCategory,
        locationData,
      });
      setDraftedReport(report);
      setStep('result');
    } catch (err) {
      const errorMessage =
        'Failed to draft the report. Please try again.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftedReport);
    toast({
      title: 'Success',
      description: 'Report copied to clipboard!',
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-10 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-semibold">{loadingMessage}</p>
          <p className="text-muted-foreground">Please wait a moment...</p>
        </div>
      );
    }

    if (error) {
      return (
         <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
         </Alert>
      );
    }

    switch (step) {
      case 'confirm':
        return (
          <div className="space-y-6">
            <div>
              {imageDataUri && (
                <Image
                  src={imageDataUri}
                  alt="Problem preview"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover w-full aspect-video"
                />
              )}
            </div>
            {aiProblemCategory && aiProblemCategory !== 'unknown' && (
              <p className="text-center text-lg">
                AI suggests this is a{' '}
                <span className="font-semibold text-primary">
                  {aiProblemCategory}
                </span>
                .
              </p>
            )}
            {aiProblemCategory === 'unknown' && (
              <p className="text-center text-lg">
                AI could not determine the category. Please select one below.
              </p>
            )}
            <div>
              <Label className="text-base font-semibold mb-2 block">
                Confirm or change the problem category:
              </Label>
              <RadioGroup
                value={userProblemCategory}
                onValueChange={setUserProblemCategory}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {problemCategories.map(({ id, label, Icon }) => (
                  <Label
                    key={id}
                    htmlFor={id}
                    className={cn(
                      'flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                      { 'border-primary': userProblemCategory === id }
                    )}
                  >
                    <RadioGroupItem value={id} id={id} className="sr-only" />
                    <Icon className="h-8 w-8 mb-2" />
                    <span className="font-medium">{label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            {location && (
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>
                  Location captured: {location.latitude.toFixed(4)},{' '}
                  {location.longitude.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        );
      case 'result':
        return (
          <div className="space-y-4">
            <Textarea
              readOnly
              value={draftedReport}
              className="min-h-[200px] text-base"
              aria-label="Drafted report"
            />
            <p className="text-sm text-muted-foreground">
              Review the report above. You can copy it or send it directly via your email client.
            </p>
          </div>
        );
      case 'upload':
      default:
        return (
          <div className="space-y-4 text-center">
            <div
              className="border-2 border-dashed border-border rounded-lg p-10 cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-lg font-semibold">
                Click to upload a photo
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, or WEBP accepted
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />
            {imageFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {imageFile.name}
              </p>
            )}
          </div>
        );
    }
  };

  const renderFooter = () => {
    if (isLoading) return null;

    switch (step) {
      case 'confirm':
        return (
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setStep('upload')}>
              Back
            </Button>
            <Button onClick={handleDraftReport} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Draft Report
            </Button>
          </div>
        );
      case 'result':
        return (
          <div className="flex flex-wrap gap-2 justify-between">
            <Button variant="outline" onClick={resetState}>
              <RefreshCw className="mr-2" /> Start New Report
            </Button>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard}>
                <ClipboardCopy className="mr-2" /> Copy Report
              </Button>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a
                  href={`mailto:public.works@city.gov?subject=New Urban Problem Report: ${userProblemCategory}&body=${encodeURIComponent(
                    draftedReport
                  )}`}
                >
                  <Mail className="mr-2" /> Send Email
                </a>
              </Button>
            </div>
          </div>
        );
      case 'upload':
      default:
        return (
          <div className="flex justify-end">
            <Button
              onClick={handleAnalyze}
              disabled={!imageFile}
              size="lg"
            >
              Analyze Image
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="w-full shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">
          {step === 'upload' && 'Step 1: Upload Photo'}
          {step === 'confirm' && 'Step 2: Confirm Details'}
          {step === 'result' && 'Step 3: Submit Report'}
        </CardTitle>
        <CardDescription>
          {step === 'upload' && 'Start by uploading a photo of the problem.'}
          {step === 'confirm' &&
            'Our AI has analyzed your image. Please confirm the details below.'}
          {step === 'result' &&
            'Your report is ready. Copy it or send it via email.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[250px] flex-grow flex items-center justify-center">
        {renderContent()}
      </CardContent>
      <CardFooter>
        {renderFooter()}
      </CardFooter>
    </Card>
  );
}
