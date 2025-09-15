
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type LoginType = 'citizen' | 'panchayat';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loginType, setLoginType] = useState<LoginType>('citizen');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    
    // In a real app, you would handle authentication here.
    // For now, we'll just simulate a successful login.
    sessionStorage.setItem('user', JSON.stringify({ email, type: loginType }));

    toast({
      title: 'Login Successful',
      description: `Welcome! You are logged in as a ${loginType}.`,
    });
    
    router.push('/');
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Tabs defaultValue="citizen" className="w-[400px]" onValueChange={(value) => setLoginType(value as LoginType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="citizen">Citizen</TabsTrigger>
          <TabsTrigger value="panchayat">Panchayat Head</TabsTrigger>
        </TabsList>
        <TabsContent value="citizen">
          <Card>
            <CardHeader>
              <CardTitle>Citizen Login</CardTitle>
              <CardDescription>Enter your credentials to report issues in your Panchayat.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="citizen-email">Email</Label>
                  <Input id="citizen-email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizen-password">Password</Label>
                  <Input id="citizen-password" name="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Login</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="panchayat">
          <Card>
            <CardHeader>
              <CardTitle>Panchayat Head Login</CardTitle>
              <CardDescription>Access the dashboard to view and manage reported issues.</CardDescription>
            </CardHeader>
             <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="panchayat-email">Email</Label>
                  <Input id="panchayat-email" name="email" type="email" placeholder="head@panchayat.gov" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panchayat-password">Password</Label>
                  <Input id="panchayat-password" name="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Login</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
