
'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceReporterProps {
  onResult: (transcript: string) => void;
}

export function VoiceReporter({ onResult }: VoiceReporterProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        // You could show a message to the user that their browser doesn't support this feature
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsProcessing(true); // Show processing spinner briefly
        setTimeout(() => setIsProcessing(false), 500);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
            variant: 'destructive',
            title: 'Voice Error',
            description: `Could not recognize speech: ${event.error}`
        });
        setIsListening(false);
        setIsProcessing(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [onResult, toast]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
        toast({
            variant: 'destructive',
            title: 'Unsupported Browser',
            description: 'Your browser does not support voice recognition.'
        });
        return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const getIcon = () => {
    if(isProcessing) return <Loader2 className="h-4 w-4 animate-spin" />;
    if(isListening) return <MicOff className="h-4 w-4" />;
    return <Mic className="h-4 w-4" />;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggleListening}
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8",
        isListening && "text-red-500 animate-pulse"
      )}
      aria-label="Report with voice"
    >
      {getIcon()}
    </Button>
  );
}
