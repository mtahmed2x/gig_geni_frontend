// src/components/competitions/quiz/QuizTakingPage.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Timer,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { QuizQuestion, QuestionDifficulty } from "@/types"; // Assuming global types
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- MOCK DATA (to be replaced by API call) ---
const mockQuizData = {
  competitionTitle: "Frontend Developer Challenge",
  timeLimitMinutes: 20,
  questions: [
    {
      _id: "1",
      question: "What is the primary purpose of React hooks?",
      type: "single",
      options: [
        { text: "State management" },
        { text: "Styling" },
        { text: "API calls" },
      ],
      points: 10,
      difficulty: "easy",
      category: "React",
    },
    {
      _id: "2",
      question:
        "Which of the following are valid ways to style a React component?",
      type: "multiple",
      options: [
        { text: "Inline styles" },
        { text: "CSS Modules" },
        { text: "Styled-components" },
      ],
      points: 10,
      difficulty: "medium",
      category: "React",
    },
    {
      _id: "3",
      question: "The virtual DOM is always faster than the real DOM.",
      type: "true_false",
      points: 5,
      difficulty: "easy",
      category: "React",
    },
    {
      _id: "4",
      question: 'Briefly explain the concept of "lifting state up" in React.',
      type: "short",
      wordLimit: 100,
      points: 15,
      difficulty: "medium",
      category: "React",
    },
    {
      _id: "5",
      question:
        "Describe a use case for the `useReducer` hook over `useState`.",
      type: "broad",
      wordLimit: 250,
      points: 20,
      difficulty: "hard",
      category: "React",
    },
  ] as QuizQuestion[],
};

export default function QuizTakingPageContent() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizState, setQuizState] = useState<"idle" | "active" | "finished">(
    "idle"
  );
  const [warningCount, setWarningCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  // --- Anti-Cheating and Timer Logic ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && quizState === "active") {
        setWarningCount((prev) => prev + 1);
        setShowWarningModal(true);
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
  }, [quizState]);

  useEffect(() => {
    if (quizState === "active" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizState === "active") {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizState]);

  // --- Data Fetching Simulation ---
  useEffect(() => {
    // In a real app, you'd dispatch an action here to fetch quiz data
    setQuestions(mockQuizData.questions);
    setTimeLimit(mockQuizData.timeLimitMinutes * 60);
    setTimeLeft(mockQuizData.timeLimitMinutes * 60);
  }, [competitionId]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const startQuiz = () => setQuizState("active");

  const handleSubmitQuiz = useCallback(() => {
    setQuizState("finished");
    // In a real app, you would send `answers` to the backend for scoring.
    // Here we simulate scoring on the client.
    const score = 75; // Mock score
    setFinalScore(score);
  }, [answers]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timeProgress = (timeLeft / timeLimit) * 100;

  // --- UI RENDER STATES ---
  if (quizState === "idle") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Instructions for: {mockQuizData.competitionTitle}
          </CardTitle>
          <CardDescription>
            Read the following instructions carefully before you begin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 space-y-2">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              <span>
                You will have{" "}
                <strong>{mockQuizData.timeLimitMinutes} minutes</strong> to
                complete the quiz.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Once started, you cannot pause the timer.</span>
            </div>
          </div>
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 space-y-2">
            <p className="font-bold">Anti-Cheating Measures are active:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>Switching browser tabs or applications will be flagged.</li>
              <li>Copying and pasting is disabled.</li>
              <li>Right-clicking is disabled.</li>
              <li>
                Multiple warnings may result in automatic disqualification.
              </li>
            </ul>
          </div>
          <Button onClick={startQuiz} className="w-full" size="lg">
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizState === "finished") {
    const passed = finalScore !== null && finalScore >= 80; // Assuming 80 is the passing score
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {passed ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          <CardDescription>Thank you for your submission.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">Your final score is:</p>
          <p
            className={`text-5xl font-bold ${
              passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {finalScore}%
          </p>
          <p className="text-muted-foreground">
            {passed
              ? "Congratulations! You have advanced to the next round."
              : "Unfortunately, you did not meet the passing score for this round."}
          </p>
          <Button
            onClick={() =>
              router.push(`/competitions/${competitionId}/journey`)
            }
          >
            Return to Journey
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Timer and Progress */}
      <Card className="sticky top-4 z-10 mb-6">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <Timer className="h-5 w-5" />
              <span>
                {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
              </span>
            </div>
          </div>
          <Progress value={timeProgress} className="h-2 [&>div]:bg-red-500" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">
                  {currentQuestion.question}
                </CardTitle>
                <Badge variant="secondary">
                  {currentQuestion.points} Points
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Answer Area */}
              <div className="space-y-4">
                {currentQuestion.type === "single" && (
                  <RadioGroup
                    value={answers[currentQuestion._id]}
                    onValueChange={(val) =>
                      handleAnswerChange(currentQuestion._id, val)
                    }
                  >
                    {currentQuestion.options?.map((opt, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                      >
                        <RadioGroupItem value={opt.text} id={`opt-${i}`} />
                        <Label
                          htmlFor={`opt-${i}`}
                          className="flex-1 cursor-pointer"
                        >
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {currentQuestion.type === "multiple" && (
                  <div className="space-y-2">
                    {currentQuestion.options?.map((opt, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                      >
                        <Checkbox
                          id={`opt-${i}`}
                          checked={(
                            answers[currentQuestion._id] || []
                          ).includes(opt.text)}
                          onCheckedChange={(checked) => {
                            const current = answers[currentQuestion._id] || [];
                            const newAnswers = checked
                              ? [...current, opt.text]
                              : current.filter((a: string) => a !== opt.text);
                            handleAnswerChange(currentQuestion._id, newAnswers);
                          }}
                        />
                        <Label
                          htmlFor={`opt-${i}`}
                          className="flex-1 cursor-pointer"
                        >
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
                {currentQuestion.type === "true_false" && (
                  <RadioGroup
                    value={answers[currentQuestion._id]}
                    onValueChange={(val) =>
                      handleAnswerChange(currentQuestion._id, val)
                    }
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <RadioGroupItem value="True" id="opt-true" />
                      <Label
                        htmlFor="opt-true"
                        className="flex-1 cursor-pointer"
                      >
                        True
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <RadioGroupItem value="False" id="opt-false" />
                      <Label
                        htmlFor="opt-false"
                        className="flex-1 cursor-pointer"
                      >
                        False
                      </Label>
                    </div>
                  </RadioGroup>
                )}
                {(currentQuestion.type === "short" ||
                  currentQuestion.type === "broad") && (
                  <Textarea
                    value={answers[currentQuestion._id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestion._id, e.target.value)
                    }
                    rows={currentQuestion.type === "short" ? 5 : 10}
                    placeholder="Type your answer here..."
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex((p) => Math.max(0, p - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={() =>
              setCurrentQuestionIndex((p) =>
                Math.min(questions.length - 1, p + 1)
              )
            }
          >
            Next
          </Button>
        )}
      </div>

      {/* Anti-cheat Warning Modal */}
      <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              Warning!
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have switched browser tabs or applications. This action has
              been recorded. Continuous violations may lead to disqualification.
              You have received {warningCount} warning(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowWarningModal(false)}>
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
