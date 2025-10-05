"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { QuizQuestion } from "@/types";
import { useFetchQuizQuestionsQuery } from "@/store/api/quizQuestionApi";
import {
  useCreateQuizSettingsMutation,
  useGetQuizSettingsQuery,
  useUpdateQuizSettingsMutation,
} from "@/store/api/quizSettingsApi";

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
  const { data: questions = [] } = useFetchQuizQuestionsQuery(competitionId);
  const { data: fetchedSettings, isLoading: isLoadingSettings } =
    useGetQuizSettingsQuery(competitionId);
  const [createSettings, { isLoading: isCreating }] =
    useCreateQuizSettingsMutation();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateQuizSettingsMutation();

  const [localSettings, setLocalSettings] = useState(initialSettings);

  useEffect(() => {
    if (fetchedSettings) {
      setLocalSettings({
        passingScore: fetchedSettings.passingScore,
        timeLimit: fetchedSettings.timeLimit,
        randomizeQuestions: fetchedSettings.randomizeQuestions,
        showResults: fetchedSettings.showResults,
      });
    }
  }, [fetchedSettings]);

  const handleSettingsChange = (
    field: keyof typeof initialSettings,
    value: any
  ) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
  };

  // --- STEP 3: Implement the core create/update logic in the save handler ---
  const handleSave = async () => {
    const payload = {
      ...localSettings,
      competitionId,
    };

    try {
      // If fetchedSettings exists, it means we have an ID and should update.
      if (fetchedSettings?._id) {
        await updateSettings({ id: fetchedSettings._id, payload }).unwrap();
      } else {
        // Otherwise, we create new settings.
        await createSettings(payload).unwrap();
      }
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

  // Combine loading states for the UI
  const isSaving = isCreating || isUpdating;

  if (isLoadingSettings) {
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
                  handleSettingsChange(
                    "passingScore",
                    parseInt(e.target.value) || 0
                  )
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
                  handleSettingsChange(
                    "timeLimit",
                    parseInt(e.target.value) || 0
                  )
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
          <Button onClick={handleSave} className="w-full" disabled={isSaving}>
            {isSaving ? (
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
