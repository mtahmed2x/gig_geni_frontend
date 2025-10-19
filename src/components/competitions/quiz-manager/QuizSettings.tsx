"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { QuizQuestion } from "@/lib/features/quizQuestion/types"; // Corrected type import path
import { useGetAllQuizQuestionQuery } from "@/lib/api/quizQuestionApi";
import {
  useGetCompetitionQuery,
  useUpdateCompetitionMutation,
} from "@/lib/api/competitionApi"; // Corrected API hooks

const initialSettings = {
  passingScore: 80,
  timeLimit: 30,
  randomizeQuestions: false,
  showResults: true,
};

interface QuizSettingsProps {
  competitionId: string;
}

export default function QuizSettings({ competitionId }: QuizSettingsProps) {
  // 1. Fetch the entire competition object to get its settings
  const { data: competitionData, isLoading: isLoadingCompetition } =
    useGetCompetitionQuery(competitionId);

  // 2. Fetch the questions separately for the distribution display
  const { data: questionsData } = useGetAllQuizQuestionQuery(competitionId, {
    skip: !competitionId,
  });
  const questions: QuizQuestion[] = questionsData?.data || [];

  // 3. Use the correct mutation to update the competition
  const [updateCompetition, { isLoading: isUpdating }] =
    useUpdateCompetitionMutation();

  const [localSettings, setLocalSettings] = useState(initialSettings);

  // 4. Populate the local state from the fetched competition data
  useEffect(() => {
    // Check for the nested quizSettings object in the response
    if (competitionData?.data?.quizSettings) {
      setLocalSettings(competitionData.data.quizSettings);
    }
  }, [competitionData]);

  const handleSettingsChange = (
    field: keyof typeof initialSettings,
    value: string | number | boolean
  ) => {
    // Ensure numbers are parsed correctly
    const parsedValue =
      typeof initialSettings[field] === "number" ? Number(value) : value;
    setLocalSettings((prev) => ({ ...prev, [field]: parsedValue }));
  };

  // 5. Implement the save handler using the updateCompetition mutation
  const handleSave = async () => {
    try {
      // The payload is the competition ID and the nested quizSettings object
      await updateCompetition({
        id: competitionId,
        quizSettings: localSettings,
      }).unwrap();
      toast.success("Quiz settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    }
  };

  const difficultyDistribution = useMemo(
    () => ({
      easy: questions.filter((q) => q.difficulty === "easy").length,
      medium: questions.filter((q) => q.difficulty === "medium").length,
      hard: questions.filter((q) => q.difficulty === "hard").length,
    }),
    [questions]
  );

  if (isLoadingCompetition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4">Loading Settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="passingScore"
                className="block text-sm font-medium mb-2"
              >
                Passing Score (%)
              </Label>
              <Input
                id="passingScore"
                type="number"
                value={localSettings.passingScore}
                onChange={(e) =>
                  handleSettingsChange("passingScore", e.target.value)
                }
                min="0"
                max="100"
              />
              <p className="text-xs text-gray-600 mt-1">
                Participants need this score to advance.
              </p>
            </div>
            <div>
              <Label
                htmlFor="timeLimit"
                className="block text-sm font-medium mb-2"
              >
                Time Limit (minutes)
              </Label>
              <Input
                id="timeLimit"
                type="number"
                value={localSettings.timeLimit}
                onChange={(e) =>
                  handleSettingsChange("timeLimit", e.target.value)
                }
                min="5"
                max="180"
              />
              <p className="text-xs text-gray-600 mt-1">
                Maximum time allowed for completion.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label
                  htmlFor="randomize"
                  className="font-medium cursor-pointer"
                >
                  Randomize Questions
                </Label>
                <p className="text-sm text-gray-600">
                  Show questions in random order for each participant.
                </p>
              </div>
              <Switch
                id="randomize"
                checked={localSettings.randomizeQuestions}
                onCheckedChange={(checked) =>
                  handleSettingsChange("randomizeQuestions", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label
                  htmlFor="showResults"
                  className="font-medium cursor-pointer"
                >
                  Show Results Immediately
                </Label>
                <p className="text-sm text-gray-600">
                  Display score and answers after submission.
                </p>
              </div>
              <Switch
                id="showResults"
                checked={localSettings.showResults}
                onCheckedChange={(checked) =>
                  handleSettingsChange("showResults", checked)
                }
              />
            </div>
          </div>
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-4">
              Question Distribution ({questions.length} total)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-2 bg-green-50 rounded-md">
                <div className="text-2xl font-bold text-green-600">
                  {difficultyDistribution.easy}
                </div>
                <div className="text-sm text-gray-600">Easy</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded-md">
                <div className="text-2xl font-bold text-yellow-600">
                  {difficultyDistribution.medium}
                </div>
                <div className="text-sm text-gray-600">Medium</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-md">
                <div className="text-2xl font-bold text-red-600">
                  {difficultyDistribution.hard}
                </div>
                <div className="text-sm text-gray-600">Hard</div>
              </div>
            </div>
          </div>
          <Button onClick={handleSave} className="w-full" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Quiz Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
