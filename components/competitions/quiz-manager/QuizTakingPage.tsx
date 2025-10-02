// src/components/competitions/quiz/QuizTakingPage.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { QuizQuestion } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuizQuestions,
  selectQuizIsLoading,
  selectQuizQuestions,
} from "@/store/slices/quizQuestionSlice";
import { AppDispatch, RootState } from "@/store";

// Mock data for static content until it comes from a Competition API
const mockCompetitionDetails = {
  title: "Frontend Developer Challenge",
  timeLimitMinutes: 20,
};

export default function QuizTakingPageContent() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const competitionId = params.id as string;

  const questionsFromStore = useSelector(selectQuizQuestions);
  const isLoading = useSelector(selectQuizIsLoading);
  const error = useSelector((state: RootState) => state.quizQuestion.error);

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

  const [isSkipConfirmOpen, setIsSkipConfirmOpen] = useState(false);

  // --- Data Fetching from API ---
  useEffect(() => {
    if (competitionId) {
      dispatch(fetchQuizQuestions(competitionId));
    }
  }, [dispatch, competitionId]);

  useEffect(() => {
    if (questionsFromStore && questionsFromStore.length > 0) {
      setQuestions(questionsFromStore);
      const timeInSeconds = mockCompetitionDetails.timeLimitMinutes * 60;
      setTimeLimit(timeInSeconds);
      setTimeLeft(timeInSeconds);
    }
  }, [questionsFromStore]);

  // --- Block browser back navigation during quiz ---
  useEffect(() => {
    if (quizState === "active") {
      window.history.pushState(null, "", window.location.href);

      const handlePopState = (event: PopStateEvent) => {
        window.history.pushState(null, "", window.location.href);
        alert(
          "You cannot go back during the quiz. Use the navigation buttons within the quiz. Leaving the page may result in disqualification."
        );
      };

      window.addEventListener("popstate", handlePopState);

      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue =
          "Are you sure you want to leave? Your quiz progress will be lost and you may be disqualified.";
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [quizState]);

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

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const startQuiz = () => setQuizState("active");

  const handleSubmitQuiz = useCallback(() => {
    setQuizState("finished");
    const score = 75; // Mock score
    setFinalScore(score);
  }, [answers]);

  const proceedToNextQuestion = () => {
    if (isSkipConfirmOpen) setIsSkipConfirmOpen(false);
    setCurrentQuestionIndex((p) => Math.min(questions.length - 1, p + 1));
  };

  const handleNextClick = () => {
    const currentQuestionId = questions[currentQuestionIndex]._id;
    const currentAnswer = answers[currentQuestionId];

    const isAnswered =
      currentAnswer !== undefined &&
      currentAnswer !== null &&
      currentAnswer !== "" &&
      !(Array.isArray(currentAnswer) && currentAnswer.length === 0);

    if (isAnswered) {
      proceedToNextQuestion();
    } else {
      setIsSkipConfirmOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-destructive">
        <XCircle className="h-8 w-8" />
        <p className="mt-4">
          Failed to load quiz questions. Please try again later.
        </p>
        <p className="text-sm text-muted-foreground mt-1">Error: {error}</p>
      </div>
    );
  }

  if (quizState === "idle") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Instructions for: {mockCompetitionDetails.title}
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
                <strong>
                  {mockCompetitionDetails.timeLimitMinutes} minutes
                </strong>{" "}
                to complete the quiz.
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
              <li>You cannot go back to previous questions once answered.</li>
              <li>
                Attempting to leave the page will be flagged and may result in
                disqualification.
              </li>
            </ul>
          </div>
          <Button
            onClick={startQuiz}
            className="w-full"
            size="lg"
            disabled={questions.length === 0}
          >
            {questions.length > 0 ? "Start Quiz" : "No Questions Available"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizState === "finished") {
    const passed = finalScore !== null && finalScore >= 80;
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

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <div>No questions loaded.</div>;
  }
  const timeProgress = (timeLeft / timeLimit) * 100;

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

                {/* --- MODIFIED: Added instruction for multiple choice --- */}
                {currentQuestion.type === "multiple" && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Select all that apply.
                    </p>
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
                              const current =
                                answers[currentQuestion._id] || [];
                              const newAnswers = checked
                                ? [...current, opt.text]
                                : current.filter((a: string) => a !== opt.text);
                              handleAnswerChange(
                                currentQuestion._id,
                                newAnswers
                              );
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
      <div className="flex justify-end mt-6">
        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNextClick}>Next</Button>
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

      {/* Skip Question Confirmation Modal */}
      <AlertDialog open={isSkipConfirmOpen} onOpenChange={setIsSkipConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to continue?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have not answered the current question. You will not be able
              to return to it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={proceedToNextQuestion}>
              Confirm & Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
