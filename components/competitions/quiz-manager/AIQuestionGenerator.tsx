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
import { Wand2, CheckCircle, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  GenerateQuizQuestionsPayload,
  QuestionDifficulty,
  QuizQuestion,
} from "@/types";
import {
  useAddMultipleQuizQuestionsMutation,
  useGenerateQuizQuestionsMutation,
} from "@/store/api/quizQuestionApi";

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
    useAddMultipleQuizQuestionsMutation();

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

    const payload = {
      competitionId,
      questions: aiGeneratedQuestions,
    };

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
            <div className="space-y-4">{/* Form Part 1: Unchanged */}</div>
            <div className="space-y-4">
              {/* Form Part 2: Unchanged */}
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
                    "Generating..."
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
                      <p className="font-medium text-sm pr-4">
                        Q{index + 1}: {question.question}
                      </p>
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
                    {/* --- STEP 6: Add the remove button for each question --- */}
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
            {/* --- STEP 7: Update final action buttons --- */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4 mt-4">
              <Button
                onClick={handleAddSelectedQuestions}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isBusy || aiGeneratedQuestions.length === 0}
              >
                {isAdding ? (
                  "Adding..."
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
