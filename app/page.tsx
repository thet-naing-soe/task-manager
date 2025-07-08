import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center space-y-6">
        <h1 className=" text-4xl font-bold">Task Manager</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your task management system
        </p>
        <div className="flex gap-4 justify-center">
          <Button>Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="destructive">Delete</Button>
        </div>
        <div className="mt-8 p-6 rounded-lg border bg-card">
          <h2 className="text-2xl font-semibold mb-2">Card Example</h2>
          <p className="text-muted-foreground">
            This card will change colors based on theme
          </p>
        </div>
      </div>
    </main>
  );
}
