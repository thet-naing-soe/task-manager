'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

export function SignInButton() {
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
    >
      <Chrome className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
