"use client";

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50/40 to-amber-50/60 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Something went wrong!</CardTitle>
          <CardDescription className="text-red-600">
            An unexpected error occurred. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <strong>Error:</strong> {error.message}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={reset}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
