
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Mock data for the dashboard
const issuesPerMonth = [
    { name: 'Jan', issues: 30 },
    { name: 'Feb', issues: 45 },
    { name: 'Mar', issues: 60 },
    { name: 'Apr', issues: 50 },
    { name: 'May', issues: 70 },
    { name: 'Jun', issues: 85 },
];

const issueCategories = [
    { name: 'Potholes', value: 400 },
    { name: 'Streetlights', value: 300 },
    { name: 'Garbage', value: 300 },
    { name: 'Water Logging', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const kpiData = {
    totalIssues: 1200,
    resolvedIssues: 950,
    avgResolutionTime: 5.2, // in days
};

const chartConfig = {
  issues: {
    label: "Issues",
    color: "hsl(var(--chart-1))",
  },
}

export default function DashboardPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<{ email: string; type: string } | null>(null);

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem('user');
        if (loggedInUser) {
            const parsedUser = JSON.parse(loggedInUser);
            if (parsedUser.type === 'panchayat') {
                setUser(parsedUser);
            } else {
                // Redirect if not a panchayat head
                toast({
                    variant: 'destructive',
                    title: 'Access Denied',
                    description: 'You do not have permission to view this page.',
                });
                router.push('/');
            }
        } else {
            router.push('/login');
        }
    }, [router, toast]);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
        router.push('/');
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen flex flex-col">
            <header className="bg-primary text-primary-foreground flex justify-between items-center p-4 px-10 border-b">
                <Link href="/" className="text-3xl font-bold text-primary-foreground">GramSeva</Link>
                <nav className="flex items-center space-x-4">
                    <Button variant="link" className="text-primary-foreground text-lg" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="link" className="text-primary-foreground text-lg" asChild>
                        <Link href="/reported-issues">All Issues</Link>
                    </Button>
                    <Button variant="link" className="text-primary-foreground text-lg" onClick={handleLogout}>
                        Logout
                    </Button>
                </nav>
            </header>
            
            <main className="p-5 flex-grow">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-primary">Panchayat Dashboard</h1>
                        <p className="text-muted-foreground mt-2">
                            Analytics and insights on reported community issues.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{kpiData.totalIssues}</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{kpiData.resolvedIssues}</div>
                                <p className="text-xs text-muted-foreground">{(kpiData.resolvedIssues / kpiData.totalIssues * 100).toFixed(1)}% resolution rate</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{kpiData.avgResolutionTime} days</div>
                                <p className="text-xs text-muted-foreground">-5% from last month</p>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Issues Reported Per Month</CardTitle>
                                <CardDescription>Tracking issue submission trends over the last 6 months.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={issuesPerMonth}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Bar dataKey="issues" fill="var(--color-issues)" radius={4} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Most Common Issue Types</CardTitle>
                                <CardDescription>Breakdown of all reported issues by category.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={issueCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                                {issueCategories.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<ChartTooltipContent hideLabel />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
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
