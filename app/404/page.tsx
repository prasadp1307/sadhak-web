import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-emerald-50/60 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-amber-200">
        <CardHeader className="text-center border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <FileQuestion className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle className="text-amber-800">Page Not Found</CardTitle>
          <CardDescription className="text-amber-600">
            The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            This might be because the page was moved, deleted, or you entered the wrong URL.
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/" className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/patient" className="w-full">
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                View Patients
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
