import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ServerError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50/40 to-amber-50/60 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Server Error</CardTitle>
          <CardDescription className="text-red-600">
            Something went wrong on our end. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            We're experiencing technical difficulties. Our team has been notified and is working to fix the issue.
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
