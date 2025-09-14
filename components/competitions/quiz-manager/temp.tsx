"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Import Redux hooks and actions, including the new `setQuestions`
import { useAppDispatch, useAppSelector } from "@/store";
import {
  generateQuizQuestions,
  setQuestions, // <-- Import the new synchronous action
  selectQuizIsLoading,
} from "@/store/slices/quizQuestionSlice";
import {
  GenerateQuizQuestionsPayload,
  QuestionDifficulty,
  QuizQuestion,
} from "@/types";

interface AIQuestionGeneratorProps {
  competitionId: string;
}

export default function AIQuestionGenerator({
  competitionId,
}: AIQuestionGeneratorProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectQuizIsLoading);

  const [aiQuestionSet, setAiQuestionSet] = useState({
    category: "",
    difficulty: "medium" as QuestionDifficulty,
    totalQuestions: 10,
    distribution: {
      single: 2,
      multiple: 2,
      true_false: 2,
      short: 2,
      broad: 2,
    },
    shortWordLimit: 100,
    broadWordLimit: 500,
    pointsPerQuestion: 10,
    description: "",
  });

  // --- Local state for the preview is restored ---
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<
    QuizQuestion[]
  >([]);
  const [showAiPreview, setShowAiPreview] = useState(false);

  const handleGenerateQuestions = async () => {
    // --- Form validation ---
    const totalInDistribution = Object.values(
      aiQuestionSet.distribution
    ).reduce((a, b) => a + b, 0);
    if (totalInDistribution !== aiQuestionSet.totalQuestions) {
      return toast.error(
        `Distribution total (${totalInDistribution}) must match total questions (${aiQuestionSet.totalQuestions}).`
      );
    }

    const payload: GenerateQuizQuestionsPayload = {
      competitionId: competitionId,
      ...aiQuestionSet,
    };

    try {
      // Dispatch the thunk and wait for the returned data
      const result = await dispatch(generateQuizQuestions(payload)).unwrap();

      // Store the result in local state for previewing
      if (result && result.length > 0) {
        setAiGeneratedQuestions(result);
        setShowAiPreview(true);
        toast.success(
          "AI preview generated successfully! Please review the questions below."
        );
      } else {
        toast.error(
          "The AI did not return any questions. Please adjust your parameters and try again."
        );
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during generation.");
    }
  };

  const handleApproveAndAdd = () => {
    // Dispatch the synchronous `setQuestions` action with the previewed data
    dispatch(setQuestions(aiGeneratedQuestions));
    toast.success(
      "Questions have been approved and added to your competition!"
    );

    // Clear the local preview state and reset the form
    setAiGeneratedQuestions([]);
    setShowAiPreview(false);
    setAiQuestionSet({
      category: "",
      difficulty: "medium",
      totalQuestions: 10,
      distribution: {
        single: 2,
        multiple: 2,
        true_false: 2,
        short: 2,
        broad: 2,
      },
      shortWordLimit: 100,
      broadWordLimit: 500,
      pointsPerQuestion: 10,
      description: "",
    });
  };

  const handleReject = () => {
    // Simply clear the local preview state
    setAiGeneratedQuestions([]);
    setShowAiPreview(false);
    toast.info("Generated questions have been discarded.");
  };

  const totalQuestionsInSet = Object.values(aiQuestionSet.distribution).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Question Set Generation</CardTitle>
          <CardDescription>
            Generate a complete set of questions using AI. This will replace any
            existing questions upon approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Part 1: Category, Description, etc. (JSX Unchanged) */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category/Subject
                  </label>
                  <Input
                    value={aiQuestionSet.category}
                    onChange={(e) =>
                      setAiQuestionSet((p) => ({
                        ...p,
                        category: e.target.value,
                      }))
                    }
                    placeholder="e.g., JavaScript, Marketing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Topic Description
                  </label>
                  <Textarea
                    value={aiQuestionSet.description}
                    onChange={(e) =>
                      setAiQuestionSet((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the specific topics or skills..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Total Questions
                    </label>
                    <Input
                      type="number"
                      value={aiQuestionSet.totalQuestions}
                      onChange={(e) =>
                        setAiQuestionSet((p) => ({
                          ...p,
                          totalQuestions: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="1"
                      max="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Difficulty Level
                    </label>
                    <Select
                      value={aiQuestionSet.difficulty}
                      onValueChange={(value: QuestionDifficulty) =>
                        setAiQuestionSet((p) => ({ ...p, difficulty: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            {/* Form Part 2: Distribution (JSX Unchanged) */}
            <div className="space-y-4">
              {/* ... */}
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 mb-3">
                  Distribution Total: {totalQuestionsInSet} /{" "}
                  {aiQuestionSet.totalQuestions}
                </div>
                <Button
                  onClick={handleGenerateQuestions}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Generating Preview..."
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Preview
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- AI Question Set Preview Section (Restored and Corrected) --- */}
      {showAiPreview && aiGeneratedQuestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              AI Generated Preview
            </CardTitle>
            <CardDescription className="text-blue-700">
              Review the {aiGeneratedQuestions.length} questions below. Add them
              to replace your current question set, or reject and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto p-2 border-y bg-white">
              {aiGeneratedQuestions.map((question, index) => (
                <div key={question._id} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm pr-4">
                      Q{index + 1}: {question.question}
                    </p>
                    <Badge variant="outline">{question.points} pts</Badge>
                  </div>
                  {question.options && question.options.length > 0 && (
                    <div className="space-y-1 text-xs text-gray-600">
                      {question.options.map((option, optIndex) => (
                        <p
                          key={option._id}
                          className={
                            option.isCorrect ? "text-green-700 font-bold" : ""
                          }
                        >
                          {String.fromCharCode(65 + optIndex)}. {option.text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-2 pt-4 mt-4">
              <Button
                onClick={handleApproveAndAdd}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve & Add Questions
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reject & Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
