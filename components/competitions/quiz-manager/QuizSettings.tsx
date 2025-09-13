"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

interface Settings {
  passingScore: number;
  timeLimit: number;
  randomizeQuestions: boolean;
  showResults: boolean;
}

interface Props {
  quizSettings: Settings;
  setQuizSettings: (s: Settings) => void;
  difficultyDistribution: { easy: number; medium: number; hard: number };
}

export default function QuizSettings({
  quizSettings,
  setQuizSettings,
  difficultyDistribution,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input
          type="number"
          value={quizSettings.passingScore}
          onChange={(e) =>
            setQuizSettings({
              ...quizSettings,
              passingScore: parseInt(e.target.value),
            })
          }
          placeholder="Passing score %"
        />
        <Input
          type="number"
          value={quizSettings.timeLimit}
          onChange={(e) =>
            setQuizSettings({
              ...quizSettings,
              timeLimit: parseInt(e.target.value),
            })
          }
          placeholder="Time limit"
        />

        <div className="flex items-center justify-between">
          <span>Randomize Questions</span>
          <input
            type="checkbox"
            checked={quizSettings.randomizeQuestions}
            onChange={(e) =>
              setQuizSettings({
                ...quizSettings,
                randomizeQuestions: e.target.checked,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Show Results</span>
          <input
            type="checkbox"
            checked={quizSettings.showResults}
            onChange={(e) =>
              setQuizSettings({
                ...quizSettings,
                showResults: e.target.checked,
              })
            }
          />
        </div>

        <div className="grid grid-cols-3 text-center">
          <div>
            <div className="text-green-600 font-bold">
              {difficultyDistribution.easy}
            </div>
            <div>Easy</div>
          </div>
          <div>
            <div className="text-yellow-600 font-bold">
              {difficultyDistribution.medium}
            </div>
            <div>Medium</div>
          </div>
          <div>
            <div className="text-red-600 font-bold">
              {difficultyDistribution.hard}
            </div>
            <div>Hard</div>
          </div>
        </div>

        <Button className="w-full bg-orange-500 hover:bg-orange-600">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}
