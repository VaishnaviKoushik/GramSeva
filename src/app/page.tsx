import { ReportWizard } from '@/components/report-wizard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-2 font-headline text-slate-800">
          Civic Lens
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          See a problem? Snap a photo. Let AI handle the report.
        </p>
        <ReportWizard />
      </div>
    </main>
  );
}
