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
import { Wand2, CheckCircle, Trash2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  GenerateQuizQuestionsPayload,
  QuestionDifficulty,
  QuizQuestion,
} from "@/types";
import {
  useCreateMultipleQuizQuestionsMutation,
  useGenerateQuizQuestionsMutation,
} from "@/lib/api/quizQuestionApi";

interface AIQuestionGeneratorProps {
  competitionId: string;
}

const initialAiState = {
  category: "",
  difficulty: "medium" as QuestionDifficulty,
  totalQuestions: 10,
  distribution: { single: 2, multiple: 2, true_false: 2, short: 2, broad: 2 },
  shortWordLimit: 100,
  broadWordLimit: 500,
  pointsPerQuestion: 10,
  description: "",
};

export default function AIQuestionGenerator({
  competitionId,
}: AIQuestionGeneratorProps) {
  const [generateQuestions, { isLoading: isGenerating }] =
    useGenerateQuizQuestionsMutation();
  const [addQuestions, { isLoading: isAdding }] =
    useCreateMultipleQuizQuestionsMutation();

  const [aiQuestionSet, setAiQuestionSet] = useState(initialAiState);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<
    QuizQuestion[]
  >([]);
  const [showAiPreview, setShowAiPreview] = useState(false);

  const handleGenerateQuestions = async () => {
    const totalInDistribution = Object.values(
      aiQuestionSet.distribution
    ).reduce((a, b) => a + b, 0);
    if (totalInDistribution !== aiQuestionSet.totalQuestions) {
      return toast.error(
        `Distribution total (${totalInDistribution}) must match total questions (${aiQuestionSet.totalQuestions}).`
      );
    }

    const payload: GenerateQuizQuestionsPayload = {
      competitionId,
      ...aiQuestionSet,
    };

    try {
      const result = await generateQuestions(payload).unwrap();
      if (result && result.length > 0) {
        setAiGeneratedQuestions(result);
        setShowAiPreview(true);
        toast.success(
          "AI preview generated! Review the questions and remove any you don't want before adding."
        );
      } else {
        toast.error(
          "The AI did not return any questions. Please adjust your parameters."
        );
      }
    } catch (error: any) {
      toast.error(
        error.data?.message || "An error occurred during generation."
      );
    }
  };

  const handleRemovePreviewQuestion = (indexToRemove: number) => {
    setAiGeneratedQuestions((prevQuestions) =>
      prevQuestions.filter((_, index) => index !== indexToRemove)
    );
    toast.info("Question removed from preview list.");
  };

  const handleAddSelectedQuestions = async () => {
    if (aiGeneratedQuestions.length === 0) {
      toast.warning("There are no questions in the preview to add.");
      return;
    }

    const payload = { competitionId, questions: aiGeneratedQuestions };

    try {
      await addQuestions(payload).unwrap();
      toast.success(
        `${aiGeneratedQuestions.length} new question(s) have been added to your competition!`
      );
      setAiGeneratedQuestions([]);
      setShowAiPreview(false);
      setAiQuestionSet(initialAiState);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to add the questions.");
    }
  };

  const handleCancel = () => {
    setAiGeneratedQuestions([]);
    setShowAiPreview(false);
    toast.info("AI-generated questions have been discarded.");
  };

  const totalQuestionsInSet = Object.values(aiQuestionSet.distribution).reduce(
    (a, b) => a + b,
    0
  );
  const isBusy = isGenerating || isAdding;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Question Generator</CardTitle>
          <CardDescription>
            Generate a set of questions using AI and add them to your
            competition.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* --- Form Part 1 --- */}
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
            {/* --- Form Part 2 --- */}
            <div className="space-y-4">
              <h3 className="font-medium">Question Type Distribution</h3>
              <div className="flex items-center justify-between">
                <label className="text-sm">Single Answer (MCQ)</label>
                <Input
                  type="number"
                  className="w-20 h-8"
                  min="0"
                  value={aiQuestionSet.distribution.single}
                  onChange={(e) =>
                    setAiQuestionSet((p) => ({
                      ...p,
                      distribution: {
                        ...p.distribution,
                        single: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Multiple Answer</label>
                <Input
                  type="number"
                  className="w-20 h-8"
                  min="0"
                  value={aiQuestionSet.distribution.multiple}
                  onChange={(e) =>
                    setAiQuestionSet((p) => ({
                      ...p,
                      distribution: {
                        ...p.distribution,
                        multiple: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">True/False</label>
                <Input
                  type="number"
                  className="w-20 h-8"
                  min="0"
                  value={aiQuestionSet.distribution.true_false}
                  onChange={(e) =>
                    setAiQuestionSet((p) => ({
                      ...p,
                      distribution: {
                        ...p.distribution,
                        true_false: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Short Descriptive</label>
                <Input
                  type="number"
                  className="w-20 h-8"
                  min="0"
                  value={aiQuestionSet.distribution.short}
                  onChange={(e) =>
                    setAiQuestionSet((p) => ({
                      ...p,
                      distribution: {
                        ...p.distribution,
                        short: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Broad Questions</label>
                <Input
                  type="number"
                  className="w-20 h-8"
                  min="0"
                  value={aiQuestionSet.distribution.broad}
                  onChange={(e) =>
                    setAiQuestionSet((p) => ({
                      ...p,
                      distribution: {
                        ...p.distribution,
                        broad: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 mb-3">
                  Distribution Total: {totalQuestionsInSet} /{" "}
                  {aiQuestionSet.totalQuestions}
                </div>
                <Button
                  onClick={handleGenerateQuestions}
                  className="w-full"
                  disabled={isBusy}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Questions for Preview
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAiPreview && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              AI Preview ({aiGeneratedQuestions.length} Questions)
            </CardTitle>
            <CardDescription className="text-blue-700">
              Review the questions below. Remove any you don't like, then click
              'Add' to append them to your quiz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto p-2 border-y bg-white rounded-md">
              {aiGeneratedQuestions.length > 0 ? (
                aiGeneratedQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm pr-4">
                          Q{index + 1}: {question.question}
                        </p>
                        <Badge variant="outline">{question.points} pts</Badge>
                      </div>
                      {question.options && question.options.length > 0 && (
                        <div className="mt-2 space-y-1 text-xs text-gray-600">
                          {question.options.map((option, optIndex) => (
                            <p
                              key={optIndex}
                              className={
                                option.isCorrect
                                  ? "text-green-700 font-bold"
                                  : ""
                              }
                            >
                              {String.fromCharCode(65 + optIndex)}.{" "}
                              {option.text}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleRemovePreviewQuestion(index)}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 flex-shrink-0"
                      disabled={isBusy}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  All generated questions have been removed.
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4 mt-4">
              <Button
                onClick={handleAddSelectedQuestions}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isBusy || aiGeneratedQuestions.length === 0}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Add {aiGeneratedQuestions.length} Selected Questions
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
                disabled={isBusy}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
