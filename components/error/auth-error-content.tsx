'use client';

import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    OAuthSignin: 'Error occurred while signing in with OAuth provider',
    OAuthCallback: 'Error occurred while handling OAuth callback',
    OAuthCreateAccount: 'Could not create OAuth provider account',
    EmailCreateAccount: 'Could not create email provider account',
    Callback: 'Error occurred in the OAuth callback',
    OAuthAccountNotLinked:
      'This account is already linked with another provider',
    Default: 'An unexpected error occurred during authentication',
  };

  const errorMessage =
    errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <CardTitle>Authentication Error</CardTitle>
        </div>
        <CardDescription>{errorMessage}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
