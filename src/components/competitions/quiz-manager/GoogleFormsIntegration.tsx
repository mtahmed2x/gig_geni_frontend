"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Upload, Copy } from "lucide-react";

interface GoogleFormsIntegrationProps {
  competitionId: string;
}

export default function GoogleFormsIntegration({
  competitionId,
}: GoogleFormsIntegrationProps) {
  const [googleFormUrl, setGoogleFormUrl] = useState("");

  const exportToGoogleForm = () => {
    // Simulate Google Form creation
    const formUrl = `https://forms.google.com/forms/d/example-${competitionId}/edit`;
    setGoogleFormUrl(formUrl);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Forms Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              Export to Google Forms
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Convert your questions into a Google Form for easy distribution
              and automatic response collection.
            </p>
            <Button
              onClick={exportToGoogleForm}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Create Google Form
            </Button>
          </div>

          {googleFormUrl && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">
                Google Form Created!
              </h3>
              <div className="flex items-center space-x-2">
                <Input value={googleFormUrl} readOnly className="flex-1" />
                <Button
                  onClick={() => navigator.clipboard.writeText(googleFormUrl)}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => window.open(googleFormUrl, "_blank")}
                  variant="outline"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Import from Google Forms
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Import questions from an existing Google Form by providing the
              form URL.
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="https://forms.google.com/forms/d/..."
                className="flex-1"
              />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
