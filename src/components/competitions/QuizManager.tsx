"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualQuestionEntry from "./quiz-manager/ManualQuestionEntry";
import AIQuestionGenerator from "./quiz-manager/AIQuestionGenerator";
import GoogleFormsIntegration from "./quiz-manager/GoogleFormsIntegration";
import QuizSettings from "./quiz-manager/QuizSettings";

interface QuizManagerProps {
  competitionId: string;
}

export default function QuizManager({ competitionId }: QuizManagerProps) {
  const [activeTab, setActiveTab] = useState("manual");

  return (
    <div className="space-y-6">
      {/* Quiz Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai">AI Generation</TabsTrigger>
          <TabsTrigger value="google">Google Forms</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <ManualQuestionEntry competitionId={competitionId} />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AIQuestionGenerator competitionId={competitionId} />
        </TabsContent>

        <TabsContent value="google" className="space-y-6">
          <GoogleFormsIntegration competitionId={competitionId} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <QuizSettings competitionId={competitionId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
