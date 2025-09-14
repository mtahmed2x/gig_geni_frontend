'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { Question } from '../QuizManager'; // Assuming QuizManager is in the parent directory

interface QuizSettingsProps {
  questions: Question[];
  settings: {
    passingScore: number;
    timeLimit: number;
    randomizeQuestions: boolean;
    showResults: boolean;
  };
  onSettingsChange: (settings: QuizSettingsProps['settings']) => void;
}

export default function QuizSettings({ questions, settings, onSettingsChange }: QuizSettingsProps) {
  const difficultyDistribution = {
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Passing Score (%)</label>
              <Input
                type="number"
                value={settings.passingScore}
                onChange={(e) => onSettingsChange({ ...settings, passingScore: parseInt(e.target.value) || 85 })}
                min="0"
                max="100"
              />
              <p className="text-xs text-gray-600 mt-1">Participants need this score to advance to Round 2</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
              <Input
                type="number"
                value={settings.timeLimit}
                onChange={(e) => onSettingsChange({ ...settings, timeLimit: parseInt(e.target.value) || 30 })}
                min="5"
                max="180"
              />
              <p className="text-xs text-gray-600 mt-1">Maximum time allowed for quiz completion</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Randomize Questions</h4>
                <p className="text-sm text-gray-600">Show questions in random order for each participant</p>
              </div>
              <input
                type="checkbox"
                checked={settings.randomizeQuestions}
                onChange={(e) => onSettingsChange({ ...settings, randomizeQuestions: e.target.checked })}
                className="h-4 w-4 text-orange-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Results Immediately</h4>
                <p className="text-sm text-gray-600">Display score and correct answers after submission</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showResults}
                onChange={(e) => onSettingsChange({ ...settings, showResults: e.target.checked })}
                className="h-4 w-4 text-orange-500"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-4">Difficulty Distribution</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{difficultyDistribution.easy}</div>
                <div className="text-sm text-gray-600">Easy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{difficultyDistribution.medium}</div>
                <div className="text-sm text-gray-600">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{difficultyDistribution.hard}</div>
                <div className="text-sm text-gray-600">Hard</div>
              </div>
            </div>
          </div>
          
          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            <Save className="h-4 w-4 mr-2" />
            Save Quiz Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}