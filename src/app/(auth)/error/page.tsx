"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "An authentication error occurred";

  return (
    <section className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md flex flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Authentication Error
            </h1>
            <p className="text-sm text-muted-foreground">
              {error}
            </p>
          </div>

          <div className="pt-4 space-y-2 w-full">
            <Button asChild className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4 space-y-2 text-xs">
          <p className="font-semibold">Possible causes:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Invalid or expired reset link</li>
            <li>Session timeout</li>
            <li>Email not confirmed</li>
            <li>User account not found</li>
          </ul>
          
          <p className="pt-2 font-semibold">What to do:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Try logging in again</li>
            <li>Request a new password reset</li>
            <li>Check your email for verification link</li>
            <li>Contact support if problem persists</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
