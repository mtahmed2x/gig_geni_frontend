"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Trash2, Edit, FileText, BarChart3 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import {
  useCreateQuizQuestionMutation,
  useGetAllQuizQuestionQuery,
} from "@/lib/api/quizQuestionApi";
import { QuestionType } from "@/lib/features/competition/types";
import {
  CreateQuizQuestionPayload,
  QuestionDifficulty,
  QuizQuestion,
} from "@/lib/features/quizQuestion/types";

// Removed unused imports

// --- Base64 Helper Functions ---

/**
 * Encodes a string to a safe Base64 string for storage, handling UTF-8.
 */
const encodeToBase64 = (str: string): string => {
  if (typeof window === "undefined") return str; // Skip on server rendering
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  // Convert byte array to binary string and then to Base64
  const binaryString = String.fromCharCode.apply(null, Array.from(data));
  return btoa(binaryString);
};

/**
 * Decodes a Base64 string back to the original UTF-8 string.
 */
const decodeFromBase64 = (base64: string): string => {
  if (typeof window === "undefined") return base64; // Skip on server rendering
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  } catch (error) {
    // Return original string if decoding fails
    console.warn("Base64 decoding failed. Returning raw content.", error);
    return base64;
  }
};
// ------------------------------

// --- IFRAME RENDERER FOR ISOLATED HTML ---
interface HtmlRendererIframeProps {
  htmlContent: string;
  className?: string;
}

const HtmlRendererIframe: React.FC<HtmlRendererIframeProps> = ({
  htmlContent,
  className,
}) => {
  // Wrap the HTML content with basic styling for a clean, contained display.
  const styledContent = `
    <html>
      <head>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 0.875rem; /* Matches text-sm */
            line-height: 1.5; 
            color: #1f2937; /* Default text color */
          }
          /* Reset common block/text elements to ensure question is legible */
          h1, h2, h3, h4, p, ul, ol, li, pre, code { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  // Encode to a Data URL
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(
    styledContent
  )}`;

  // Render the iframe
  return (
    <iframe
      src={dataUrl}
      className={`w-full border-0 overflow-hidden ${className}`}
      // Setting a minimal height; in a production app, you'd use a ref/onload to calculate content height
      style={{ height: "auto", minHeight: "100px" }}
      title="Question Content"
    />
  );
};
// ------------------------------------------

interface ManualQuestionEntryProps {
  competitionId: string;
}

const initialNewQuestionState = {
  question: "",
  type: "single" as QuestionType,
  options: ["", "", "", ""],
  correctAnswerIndexes: [0] as number[],
  points: 10,
  difficulty: QuestionDifficulty.Medium,
  wordLimit: 100,
  isMarkdown: false, // Flag is now used for 'isHTML'
};

export default function ManualQuestionEntry({
  competitionId,
}: ManualQuestionEntryProps) {
  const {
    data: questions = [],
    isLoading: isFetchingQuestions,
    isError,
  } = useGetAllQuizQuestionQuery(competitionId, {
    skip: !competitionId,
  });

  const [createQuestion, { isLoading: isCreatingQuestion }] =
    useCreateQuizQuestionMutation();

  const [newQuestion, setNewQuestion] = useState(initialNewQuestionState);
  const [editingId, setEditingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    return {
      totalQuestions: questions.length,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
      difficulty: {
        easy: questions.filter((q) => q.difficulty === "easy").length,
        medium: questions.filter((q) => q.difficulty === "medium").length,
        hard: questions.filter((q) => q.difficulty === "hard").length,
      },
    };
  }, [questions]);

  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) {
      return toast.error("Question text cannot be empty.");
    }

    // BASE64 ENCODING LOGIC
    let questionContentToSend = newQuestion.question;
    if (newQuestion.isMarkdown) {
      questionContentToSend = encodeToBase64(newQuestion.question);
    }

    const payload: CreateQuizQuestionPayload = {
      competition: competitionId,
      question: questionContentToSend,
      type: newQuestion.type,
      points: newQuestion.points,
      difficulty: newQuestion.difficulty,
      isMarkdown: newQuestion.isMarkdown,
    };

    if (["single", "multiple", "true_false"].includes(newQuestion.type)) {
      const options =
        newQuestion.type === "true_false"
          ? ["True", "False"]
          : newQuestion.options;
      if (options.some((opt) => !opt.trim())) {
        return toast.error("All options must be filled out.");
      }
      payload.options = options.map((text, index) => ({
        text,
        isCorrect: newQuestion.correctAnswerIndexes.includes(index),
      }));
    }

    if (["short", "broad"].includes(newQuestion.type)) {
      payload.wordLimit = newQuestion.wordLimit;
    }

    try {
      await createQuestion(payload).unwrap();
      toast.success("Question added successfully!");
      setNewQuestion(initialNewQuestionState);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to add question.");
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    toast.error("Delete functionality is not yet implemented.");
    console.log("TODO: Implement delete for question ID:", questionId);
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Questions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalQuestions}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPoints}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* ADD QUESTION FORM */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Question</label>
              {/* TEXTAREA REPLACEMENT */}
              <Textarea
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion((p) => ({ ...p, question: e.target.value }))
                }
                placeholder={
                  newQuestion.isMarkdown
                    ? "Enter your question using HTML syntax..."
                    : "Enter your question..."
                }
                rows={5}
              />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="isMarkdown"
                checked={newQuestion.isMarkdown}
                onCheckedChange={(checked) =>
                  setNewQuestion((p) => ({ ...p, isMarkdown: !!checked }))
                }
              />
              <Label
                htmlFor="isMarkdown"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Render question as **HTML** (Content will be Base64 encoded for
                storage)
              </Label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Question Type
              </label>
              <Select
                value={newQuestion.type}
                onValueChange={(value: QuestionType) =>
                  setNewQuestion((p) => ({
                    ...p,
                    type: value,
                    correctAnswerIndexes: value === "multiple" ? [] : [0],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Answer</SelectItem>
                  <SelectItem value="multiple">Multiple Answer</SelectItem>
                  <SelectItem value="true_false">True/False</SelectItem>
                  <SelectItem value="short">Short Descriptive</SelectItem>
                  <SelectItem value="broad">Broad Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Difficulty
                </label>
                <Select
                  value={newQuestion.difficulty}
                  onValueChange={(value: QuestionDifficulty) =>
                    setNewQuestion((p) => ({ ...p, difficulty: value }))
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
              <div>
                <label className="block text-sm font-medium mb-2">Points</label>
                <Input
                  type="number"
                  value={newQuestion.points}
                  onChange={(e) =>
                    setNewQuestion((p) => ({
                      ...p,
                      points: Math.max(0, parseInt(e.target.value, 10) || 0),
                    }))
                  }
                  placeholder="e.g., 10"
                  min="0"
                />
              </div>
            </div>

            {["single", "multiple"].includes(newQuestion.type) && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Options & Correct Answer
                </label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium w-6">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion((p) => ({ ...p, options: newOptions }));
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                    {newQuestion.type === "single" ? (
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newQuestion.correctAnswerIndexes[0] === index}
                        onChange={() =>
                          setNewQuestion((p) => ({
                            ...p,
                            correctAnswerIndexes: [index],
                          }))
                        }
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={newQuestion.correctAnswerIndexes.includes(
                          index
                        )}
                        onChange={(e) => {
                          const { checked } = e.target;
                          const currentIndexes =
                            newQuestion.correctAnswerIndexes;
                          const newIndexes = checked
                            ? [...currentIndexes, index]
                            : currentIndexes.filter((i) => i !== index);
                          setNewQuestion((p) => ({
                            ...p,
                            correctAnswerIndexes: newIndexes.sort(),
                          }));
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            {newQuestion.type === "true_false" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Correct Answer
                </label>
                <Select
                  value={newQuestion.correctAnswerIndexes[0]?.toString()}
                  onValueChange={(value) =>
                    setNewQuestion((p) => ({
                      ...p,
                      correctAnswerIndexes: [parseInt(value)],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">True</SelectItem>
                    <SelectItem value="1">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {["short", "broad"].includes(newQuestion.type) && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Word Limit
                </label>
                <Input
                  type="number"
                  value={newQuestion.wordLimit}
                  onChange={(e) =>
                    setNewQuestion((p) => ({
                      ...p,
                      wordLimit: parseInt(e.target.value),
                    }))
                  }
                  min="10"
                />
              </div>
            )}
            <Button
              onClick={handleAddQuestion}
              className="w-full"
              disabled={isCreatingQuestion}
            >
              {isCreatingQuestion ? (
                "Adding..."
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ---------------------------------------------------------------------- */}
        {/* QUESTION LIST DISPLAY */}
        {/* ---------------------------------------------------------------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[700px] overflow-y-auto">
            {isFetchingQuestions && (
              <p className="text-center text-gray-500">Loading questions...</p>
            )}
            {isError && (
              <p className="text-center text-red-500">
                Failed to load questions.
              </p>
            )}
            {!isFetchingQuestions && questions.length === 0 && (
              <p className="text-center text-gray-500">
                No questions added yet.
              </p>
            )}

            {questions.map((q: QuizQuestion, index) => {
              // ⭐ BASE64 DECODING LOGIC
              let displayedQuestion = q.question;
              if (q.isMarkdown) {
                // Decode from Base64 before displaying/rendering as HTML
                displayedQuestion = decodeFromBase64(q.question);
              }

              return (
                <div key={q._id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="prose prose-sm max-w-none pr-4">
                      <span className="font-medium">Q{index + 1}: </span>
                      {q.isMarkdown ? (
                        // ⭐ NEW ISOLATED HTML RENDERING WITH IFRAME
                        <HtmlRendererIframe
                          htmlContent={displayedQuestion}
                          className="mt-1"
                        />
                      ) : (
                        // Render as plain text
                        <span>{displayedQuestion}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge className={getDifficultyColor(q.difficulty)}>
                        {q.difficulty}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveQuestion(q._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    {q.options?.map((option, optIndex) => (
                      <div
                        key={option._id || optIndex}
                        className={`p-2 rounded text-xs ${
                          option.isCorrect
                            ? "bg-green-100 text-green-800 font-semibold"
                            : "bg-gray-100"
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option.text}
                        {option.isCorrect && " ✓"}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Points: {q.points}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
