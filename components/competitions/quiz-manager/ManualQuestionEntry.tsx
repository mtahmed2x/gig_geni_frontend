"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";

interface Question {
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
}

interface Props {
  questions: Question[];
  setQuestions: (qs: Question[]) => void;
  onQuestionsUpdate?: (questions: Question[]) => void;
}

const defaultCategories = [
  "Programming",
  "Web Development",
  "Data Science",
  "Mobile Development",
  "DevOps",
  "UI/UX Design",
  "General Knowledge",
  "Problem Solving",
];

export default function ManualQuestionEntry({
  questions,
  setQuestions,
  onQuestionsUpdate,
}: Props) {
  const [newQuestion, setNewQuestion] = useState<Omit<Question, "id">>({
    question: "",
    type: "single_answer",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 10,
    difficulty: "medium",
    category: "Programming",
    wordLimit: 100,
  });

  const addQuestion = () => {
    if (
      newQuestion.question.trim() &&
      newQuestion.options?.every((opt) => opt.trim())
    ) {
      const q: Question = { ...newQuestion, id: Date.now().toString() };
      const updated = [...questions, q];
      setQuestions(updated);
      onQuestionsUpdate?.(updated);
      setNewQuestion({
        question: "",
        type: "single_answer",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 10,
        difficulty: "medium",
        category: "Programming",
        wordLimit: 100,
      });
    }
  };

  const removeQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    onQuestionsUpdate?.(updated);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add New Question */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion((prev) => ({ ...prev, question: e.target.value }))
            }
            placeholder="Enter your question..."
            rows={3}
          />

          {/* Options (only for MCQ) */}
          {(newQuestion.type === "single_answer" ||
            newQuestion.type === "multiple_answer") && (
            <div>
              {newQuestion.options?.map((opt, i) => (
                <div key={i} className="flex items-center space-x-2 mb-2">
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...(newQuestion.options || [])];
                      newOpts[i] = e.target.value;
                      setNewQuestion((prev) => ({ ...prev, options: newOpts }));
                    }}
                    placeholder={`Option ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          <Input
            type="number"
            value={newQuestion.points}
            onChange={(e) =>
              setNewQuestion((prev) => ({
                ...prev,
                points: parseInt(e.target.value),
              }))
            }
            placeholder="Points"
          />

          <Button
            onClick={addQuestion}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {questions.map((q, i) => (
            <div key={q.id} className="p-4 border rounded-lg">
              <div className="flex justify-between">
                <h4 className="font-medium text-sm">
                  Q{i + 1}: {q.question}
                </h4>
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(q.difficulty)}>
                    {q.difficulty}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeQuestion(q.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
