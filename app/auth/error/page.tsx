import React, { Suspense } from 'react';
import { AuthErrorContent } from '@/components/error/auth-error-content';

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
