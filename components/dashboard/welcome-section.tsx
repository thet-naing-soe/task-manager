interface WelcomeSectionProps {
  userName: string;
}

export function WelcomeSection({ userName }: WelcomeSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h2>
      <p className="text-muted-foreground">Your task will apppear here.</p>
    </div>
  );
}
