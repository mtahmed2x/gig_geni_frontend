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
import { Question } from "../QuizManager"; // Assuming QuizManager is in the parent directory

interface AIQuestionGeneratorProps {
  questions: Question[];
  onQuestionsUpdate: (questions: Question[]) => void;
}

export default function AIQuestionGenerator({
  questions,
  onQuestionsUpdate,
}: AIQuestionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuestionSet, setAiQuestionSet] = useState({
    category: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    totalQuestions: 10,
    questionTypes: {
      single_answer: 0,
      multiple_answer: 0,
      short_descriptive: 0,
      true_false: 0,
      broad_question: 0,
    },
    wordLimits: {
      short_descriptive: 50,
      broad_question: 200,
    },
    description: "",
  });
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<Question[]>(
    []
  );
  const [showAiPreview, setShowAiPreview] = useState(false);

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    // Simulate AI question set generation
    setTimeout(() => {
      const generatedQuestions: Question[] = [];
      let questionId = Date.now();

      // Generate questions for each type
      Object.entries(aiQuestionSet.questionTypes).forEach(([type, count]) => {
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            const questionType = type as Question["type"];
            const question: Question = {
              id: (questionId++).toString(),
              type: questionType,
              question: `${aiQuestionSet.category} - ${questionType.replace(
                "_",
                " "
              )} question ${i + 1}: What is the best approach to solve this ${
                aiQuestionSet.description
              } problem?`,
              correctAnswer: 0,
              points: 10,
              difficulty: aiQuestionSet.difficulty,
              category: aiQuestionSet.category || "General",
            };

            if (
              questionType === "single_answer" ||
              questionType === "multiple_answer"
            ) {
              question.options = [
                `Option A for ${aiQuestionSet.category}`,
                `Option B for ${aiQuestionSet.category}`,
                `Option C for ${aiQuestionSet.category}`,
                `Option D for ${aiQuestionSet.category}`,
              ];
              question.correctAnswer =
                questionType === "single_answer" ? 0 : [0, 2];
            } else if (questionType === "true_false") {
              question.correctAnswer = "true";
            } else if (
              questionType === "short_descriptive" ||
              questionType === "broad_question"
            ) {
              question.wordLimit = aiQuestionSet.wordLimits[questionType];
              question.correctAnswer = "Sample answer for evaluation";
            }

            generatedQuestions.push(question);
          }
        }
      });

      setAiGeneratedQuestions(generatedQuestions);
      setShowAiPreview(true);
      setIsGenerating(false);
    }, 2000); // Simulate AI processing time
  };

  const totalQuestionsInSet = Object.values(aiQuestionSet.questionTypes).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Question Set Generation</CardTitle>
          <CardDescription>
            Generate a complete set of questions using AI based on your
            specifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category/Subject
                </label>
                <Input
                  value={aiQuestionSet.category}
                  onChange={(e) =>
                    setAiQuestionSet({
                      ...aiQuestionSet,
                      category: e.target.value,
                    })
                  }
                  placeholder="e.g., JavaScript, Marketing, Leadership"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Topic Description
                </label>
                <Textarea
                  value={aiQuestionSet.description}
                  onChange={(e) =>
                    setAiQuestionSet({
                      ...aiQuestionSet,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the specific topics or skills you want to test..."
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
                    onChange={(e) => {
                      const total = parseInt(e.target.value) || 0;
                      setAiQuestionSet({
                        ...aiQuestionSet,
                        totalQuestions: total,
                      });
                    }}
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
                    onValueChange={(value: "easy" | "medium" | "hard") =>
                      setAiQuestionSet({ ...aiQuestionSet, difficulty: value })
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

            <div className="space-y-4">
              <h3 className="font-medium">Question Type Distribution</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Single Answer (MCQ)</label>
                  <Input
                    type="number"
                    value={aiQuestionSet.questionTypes.single_answer}
                    onChange={(e) =>
                      setAiQuestionSet({
                        ...aiQuestionSet,
                        questionTypes: {
                          ...aiQuestionSet.questionTypes,
                          single_answer: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-20"
                    min="0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm">Multiple Answer</label>
                  <Input
                    type="number"
                    value={aiQuestionSet.questionTypes.multiple_answer}
                    onChange={(e) =>
                      setAiQuestionSet({
                        ...aiQuestionSet,
                        questionTypes: {
                          ...aiQuestionSet.questionTypes,
                          multiple_answer: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-20"
                    min="0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm">True/False</label>
                  <Input
                    type="number"
                    value={aiQuestionSet.questionTypes.true_false}
                    onChange={(e) =>
                      setAiQuestionSet({
                        ...aiQuestionSet,
                        questionTypes: {
                          ...aiQuestionSet.questionTypes,
                          true_false: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-20"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Short Descriptive</label>
                    <Input
                      type="number"
                      value={aiQuestionSet.questionTypes.short_descriptive}
                      onChange={(e) =>
                        setAiQuestionSet({
                          ...aiQuestionSet,
                          questionTypes: {
                            ...aiQuestionSet.questionTypes,
                            short_descriptive: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-20"
                      min="0"
                    />
                  </div>
                  {aiQuestionSet.questionTypes.short_descriptive > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Word limit:</span>
                      <Input
                        type="number"
                        value={aiQuestionSet.wordLimits.short_descriptive}
                        onChange={(e) =>
                          setAiQuestionSet({
                            ...aiQuestionSet,
                            wordLimits: {
                              ...aiQuestionSet.wordLimits,
                              short_descriptive: parseInt(e.target.value) || 50,
                            },
                          })
                        }
                        className="w-16 h-6"
                        min="10"
                        max="200"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Broad Questions</label>
                    <Input
                      type="number"
                      value={aiQuestionSet.questionTypes.broad_question}
                      onChange={(e) =>
                        setAiQuestionSet({
                          ...aiQuestionSet,
                          questionTypes: {
                            ...aiQuestionSet.questionTypes,
                            broad_question: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-20"
                      min="0"
                    />
                  </div>
                  {aiQuestionSet.questionTypes.broad_question > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Word limit:</span>
                      <Input
                        type="number"
                        value={aiQuestionSet.wordLimits.broad_question}
                        onChange={(e) =>
                          setAiQuestionSet({
                            ...aiQuestionSet,
                            wordLimits: {
                              ...aiQuestionSet.wordLimits,
                              broad_question: parseInt(e.target.value) || 200,
                            },
                          })
                        }
                        className="w-16 h-6"
                        min="50"
                        max="1000"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 mb-3">
                  Total: {totalQuestionsInSet} / {aiQuestionSet.totalQuestions}{" "}
                  questions
                </div>
                <Button
                  onClick={handleGenerateQuestions}
                  className="w-full"
                  disabled={
                    !aiQuestionSet.category.trim() ||
                    !aiQuestionSet.description.trim() ||
                    totalQuestionsInSet === 0 ||
                    isGenerating
                  }
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Question Set
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* AI Question Set Preview */}
          {showAiPreview && aiGeneratedQuestions.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">
                  AI Generated Question Set Preview
                </CardTitle>
                <CardDescription className="text-blue-700">
                  {aiGeneratedQuestions.length} questions generated for{" "}
                  {aiQuestionSet.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {aiGeneratedQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="bg-white p-4 rounded-lg border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {question.type.replace("_", " ")}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Question {index + 1}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {question.points} point(s)
                        </span>
                      </div>
                      <p className="font-medium mb-2">{question.question}</p>

                      {question.options && (
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type={
                                  question.type === "multiple_answer"
                                    ? "checkbox"
                                    : "radio"
                                }
                                disabled
                                checked={
                                  Array.isArray(question.correctAnswer)
                                    ? question.correctAnswer.includes(optIndex)
                                    : question.correctAnswer === optIndex
                                }
                                className="text-green-600"
                              />
                              <span
                                className={
                                  (
                                    Array.isArray(question.correctAnswer)
                                      ? question.correctAnswer.includes(
                                          optIndex
                                        )
                                      : question.correctAnswer === optIndex
                                  )
                                    ? "text-green-600 font-medium"
                                    : ""
                                }
                              >
                                {option}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.wordLimit && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Word limit: {question.wordLimit}
                          </p>
                          <div className="bg-gray-100 p-2 rounded text-sm text-gray-500 mt-1">
                            [Answer text area would appear here for
                            participants]
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      const updatedQuestions = [
                        ...questions,
                        ...aiGeneratedQuestions,
                      ];
                      onQuestionsUpdate(updatedQuestions);
                      setAiGeneratedQuestions([]);
                      setShowAiPreview(false);
                      setAiQuestionSet({
                        category: "",
                        difficulty: "medium",
                        totalQuestions: 10,
                        questionTypes: {
                          single_answer: 0,
                          multiple_answer: 0,
                          short_descriptive: 0,
                          true_false: 0,
                          broad_question: 0,
                        },
                        wordLimits: {
                          short_descriptive: 50,
                          broad_question: 200,
                        },
                        description: "",
                      });
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Add All Questions
                  </Button>
                  <Button
                    onClick={() => {
                      setAiGeneratedQuestions([]);
                      setShowAiPreview(false);
                    }}
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
        </CardContent>
      </Card>
    </div>
  );
}
