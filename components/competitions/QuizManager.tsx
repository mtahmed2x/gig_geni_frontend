"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle, Clock, BarChart3 } from "lucide-react";
import ManualQuestionEntry from "./quiz-manager/ManualQuestionEntry";
import AIQuestionGenerator from "./quiz-manager/AIQuestionGenerator";
import GoogleFormsIntegration from "./quiz-manager/GoogleFormsIntegration";
import QuizSettings from "./quiz-manager/QuizSettings";

export interface Question {
  id: string;
  question: string;
  type:
    | "single_answer"
    | "multiple_answer"
    | "short_descriptive"
    | "true_false"
    | "broad_question";
  options?: string[];
  correctAnswer: number | number[] | string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  wordLimit?: number;
  explanation?: string;
}

interface QuizManagerProps {
  competitionId: string;
}

export default function QuizManager({ competitionId }: QuizManagerProps) {
  const [activeTab, setActiveTab] = useState("manual");
  const [quizSettings, setQuizSettings] = useState({
    passingScore: 85,
    timeLimit: 30,
    randomizeQuestions: true,
    showResults: false,
  });

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
          <QuizSettings
            questions={[]}
            settings={quizSettings}
            onSettingsChange={setQuizSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
