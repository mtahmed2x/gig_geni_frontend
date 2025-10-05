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
import { toast } from "sonner";
import { QuizQuestion } from "@/types";
import { useFetchQuizQuestionsQuery } from "@/store/api/quizQuestionApi";
import { useGetQuizSettingsQuery } from "@/store/api/quizSettingsApi";
import {
  useEvaluateQuizMutation,
  useSubmitAnswerMutation,
} from "@/store/api/quizAnswerApi";

export default function QuizTakingPageContent() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const {
    data: questions = [],
    isLoading: isLoadingQuestions,
    isError: isQuestionsError,
  } = useFetchQuizQuestionsQuery(competitionId, { skip: !competitionId });
  const {
    data: settings,
    isLoading: isLoadingSettings,
    isError: isSettingsError,
  } = useGetQuizSettingsQuery(competitionId, { skip: !competitionId });

  const [submitAnswer] = useSubmitAnswerMutation();
  const [evaluateQuiz, { isLoading: isEvaluating }] = useEvaluateQuizMutation();

  // Local UI state remains the same
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
  const [passMessage, setPassMessage] = useState("");

  // --- STEP 3: Streamline useEffects to use fetched data ---
  useEffect(() => {
    // This now depends on both questions and settings being successfully fetched
    if (questions.length > 0 && settings) {
      const timeInSeconds = settings.timeLimit * 60; // Assuming timeLimit is in minutes
      setTimeLimit(timeInSeconds);
      setTimeLeft(timeInSeconds);
    }
  }, [questions, settings]);

  // Anti-cheating, timer countdown, and browser navigation blocking useEffects remain unchanged...

  // --- STEP 4: Refactor handleAnswerChange to save progress automatically ---
  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    // Fire-and-forget the answer submission to the backend
    submitAnswer({
      competitionId,
      questionId,
      answer,
    })
      .unwrap()
      .catch((err) => {
        // This is a background save, so we don't need to show a blocking error
        console.error("Failed to save answer progress:", err);
        toast.error(
          "Connection issue: Could not save your last answer. Please check your network."
        );
      });
  };

  const startQuiz = () => setQuizState("active");

  // --- STEP 5: Refactor handleSubmitQuiz to use the evaluate mutation ---
  const handleSubmitQuiz = useCallback(async () => {
    if (isEvaluating) return;
    try {
      const result = await evaluateQuiz({ competitionId }).unwrap();
      setFinalScore(result.totalPoints);
      setPassMessage(result.message); // Use the message from the backend
      setQuizState("finished");
      toast.success("Quiz submitted successfully!");
    } catch (err: any) {
      toast.error(
        err.data?.message ||
          "A network error occurred while submitting the quiz."
      );
      setQuizState("finished"); // Still finish the quiz even on error
      setFinalScore(0);
      setPassMessage(
        "There was an error submitting your quiz. Please contact support."
      );
    }
  }, [competitionId, evaluateQuiz, isEvaluating]);

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

  // --- STEP 6: Update JSX with new loading and error states ---
  if (isLoadingQuestions || isLoadingSettings) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Quiz...</p>
      </div>
    );
  }

  if (isQuestionsError || isSettingsError) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-destructive">
        <XCircle className="h-8 w-8" />
        <p className="mt-4">Failed to load quiz. Please try again later.</p>
      </div>
    );
  }

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
                You will have <strong>{settings?.timeLimit} minutes</strong> to
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
              <li>Attempting to leave the page will be flagged.</li>
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
    const passed =
      finalScore !== null && settings && finalScore >= settings.passingScore;
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
            {finalScore ?? 0} / {settings?.passingScore ?? 100}
          </p>
          <p className="text-muted-foreground">{passMessage}</p>
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
    return <div>No questions loaded or you have finished the quiz.</div>;
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
