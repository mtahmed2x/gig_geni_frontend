import { AuthGuard } from "@/components/auth/AuthGuard";
import QuizTakingPageContent from "@/components/competitions/quiz-manager/QuizTakingPage";

export default function CompetitionQuizPage() {
  return (
    <AuthGuard requireAuth={true} allowedRoles={["employee"]}>
      <div className="bg-gray-50 min-h-screen py-8 md:py-12">
        <QuizTakingPageContent />
      </div>
    </AuthGuard>
  );
}
