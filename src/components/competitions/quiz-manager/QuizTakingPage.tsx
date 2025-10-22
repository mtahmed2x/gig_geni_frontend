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
  FileQuestion,
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
import { toast } from "sonner";
import { AnswerPayload } from "@/lib/features/quizAttempt/types";

import { useGetCompetitionQuery } from "@/lib/api/competitionApi";
import { useGetAllQuizQuestionQuery } from "@/lib/api/quizQuestionApi";
import { useSubmitAnswerMutation } from "@/lib/api/quizAttemptApi";

export default function QuizTakingPageContent() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const {
    data: competitionData,
    isLoading: isLoadingCompetition,
    isError: isCompetitionError,
  } = useGetCompetitionQuery(competitionId, { skip: !competitionId });

  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    isError: isQuestionsError,
  } = useGetAllQuizQuestionQuery(competitionId, { skip: !competitionId });

  const [submitAnswer, { isLoading: isSubmitting }] = useSubmitAnswerMutation();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizState, setQuizState] = useState<"idle" | "active" | "finished">(
    "idle"
  );
  const [warningCount, setWarningCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isSkipConfirmOpen, setIsSkipConfirmOpen] = useState(false);
  const [finalResult, setFinalResult] = useState<{
    score: number;
    message: string;
    passed: boolean;
  } | null>(null);

  useEffect(() => {
    if (competitionData?.quizSettings?.timeLimit) {
      const timeInSeconds = competitionData.quizSettings.timeLimit * 60;
      setTimeLeft(timeInSeconds);
    }
  }, [competitionData]);

  const handleSubmitQuiz = useCallback(async () => {
    if (isSubmitting || !questionsData) return;

    const formattedAnswers: AnswerPayload[] = questionsData.map((q) => ({
      questionId: q._id,
      answer: answers[q._id] || null,
    }));

    try {
      const result = await submitAnswer({
        competitionId,
        answers: formattedAnswers,
      }).unwrap();

      setFinalResult({
        score: result.data?.attempt.totalScore || 0,
        message: result.data?.message || "",
        passed: result.data?.attempt.passed || false,
      });
      setQuizState("finished");
      toast.success("Quiz submitted successfully!");
    } catch (err: any) {
      toast.error(
        err.data?.message || "An error occurred while submitting the quiz."
      );
      setFinalResult({
        score: 0,
        message:
          "There was an error submitting your quiz. Please contact support.",
        passed: false,
      });
      setQuizState("finished");
    }
  }, [isSubmitting, questionsData, answers, submitAnswer, competitionId]);

  // Effect for the countdown timer
  useEffect(() => {
    if (quizState !== "active" || timeLeft === null || timeLeft <= 0) {
      if (quizState === "active" && timeLeft === 0) {
        toast.info("Time's up! Submitting your quiz automatically.");
        handleSubmitQuiz();
      }
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [quizState, timeLeft, handleSubmitQuiz]);

  // Anti-cheating visibility change listener
  useEffect(() => {
    if (quizState !== "active") return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount((prev) => prev + 1);
        setShowWarningModal(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [quizState]);

  // --- STEP 1: Add effect to disable right-click, copy, and paste ---
  useEffect(() => {
    if (quizState !== "active") return;

    const preventDefault = (e: Event) => e.preventDefault();

    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("paste", preventDefault);
    document.addEventListener("cut", preventDefault);

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("paste", preventDefault);
      document.removeEventListener("cut", preventDefault);
    };
  }, [quizState]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const startQuiz = () => setQuizState("active");

  const moveToNextQuestion = () => {
    if (questionsData && currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (!questionsData) return;
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionsData[currentQuestionIndex]._id];
      return newAnswers;
    });
    moveToNextQuestion();
    setIsSkipConfirmOpen(false);
  };

  if (isLoadingCompetition || isLoadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Quiz...</p>
      </div>
    );
  }

  if (isCompetitionError || isQuestionsError) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-destructive">
        <XCircle className="h-8 w-8" />
        <p className="mt-4">
          Failed to load quiz data. Please try again later.
        </p>
      </div>
    );
  }

  if (!competitionData || !questionsData) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">
          Quiz information could not be found.
        </p>
      </div>
    );
  }

  const { quizSettings } = competitionData;
  const currentQuestion = questionsData[currentQuestionIndex];

  if (quizState === "idle") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Instructions for the Quiz</CardTitle>
          <CardDescription>
            Read the following carefully before you begin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 space-y-2">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              <span>
                You will have{" "}
                <strong>{quizSettings?.timeLimit || "N/A"} minutes</strong> to
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
              <li>
                You cannot go back to previous questions once you've moved on.
              </li>
              <li>
                Copying, pasting, and right-clicking are disabled during the
                quiz.
              </li>
            </ul>
          </div>
          <Button
            onClick={startQuiz}
            className="w-full"
            size="lg"
            disabled={!questionsData || questionsData.length === 0}
          >
            {questionsData.length > 0 ? "Start Quiz" : "No Questions Available"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizState === "finished" && finalResult) {
    const { score, message, passed } = finalResult;
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
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-bold">{message}</p>
          <p
            className={`text-5xl font-bold ${
              passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {score.toFixed(1)}
          </p>
          <p className="text-sm text-muted-foreground">
            {passed
              ? "Congratulations! You have advanced to the next stage."
              : "Unfortunately, you did not meet the passing score for this round."}
          </p>
          <Button
            onClick={() =>
              router.push(
                passed
                  ? `/competitions/${competitionId}/journey`
                  : "/competitions"
              )
            }
          >
            {passed ? "Continue to Journey" : "Find Other Competitions"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion || timeLeft === null) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Question...</p>
      </div>
    );
  }

  const timeLimitInSeconds = (quizSettings?.timeLimit || 0) * 60;
  const timeProgress =
    timeLimitInSeconds > 0 ? (timeLeft / timeLimitInSeconds) * 100 : 0;
  const currentAnswer = answers[currentQuestion._id];
  const isAnswered =
    currentAnswer !== undefined &&
    currentAnswer !== null &&
    currentAnswer !== "" &&
    !(Array.isArray(currentAnswer) && currentAnswer.length === 0);

  // --- STEP 2: Conditionally apply the `select-none` class ---
  return (
    <div
      className={`max-w-4xl mx-auto ${
        quizState === "active" ? "select-none" : ""
      }`}
    >
      <Card className="sticky top-4 z-10 mb-6">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">
              Question {currentQuestionIndex + 1} of {questionsData.length}
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
              <div className="space-y-4">
                {currentQuestion.type === "single" && (
                  <RadioGroup
                    value={answers[currentQuestion._id] || ""}
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
                    value={String(answers[currentQuestion._id] ?? "")}
                    onValueChange={(val) =>
                      handleAnswerChange(currentQuestion._id, val === "true")
                    }
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <RadioGroupItem value="true" id="opt-true" />
                      <Label
                        htmlFor="opt-true"
                        className="flex-1 cursor-pointer"
                      >
                        True
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <RadioGroupItem value="false" id="opt-false" />
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

      <div className="flex justify-between items-center mt-6">
        <div>
          {currentQuestionIndex < questionsData.length - 1 && (
            <Button
              onClick={() => setIsSkipConfirmOpen(true)}
              variant="outline"
            >
              Skip
            </Button>
          )}
        </div>
        <div>
          {currentQuestionIndex === questionsData.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={moveToNextQuestion} disabled={!isAnswered}>
              Next
            </Button>
          )}
        </div>
      </div>
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

      <AlertDialog open={isSkipConfirmOpen} onOpenChange={setIsSkipConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to skip?</AlertDialogTitle>
            <AlertDialogDescription>
              Any answer you have selected for this question will be cleared.
              You cannot return to it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSkip}>
              Confirm & Skip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
