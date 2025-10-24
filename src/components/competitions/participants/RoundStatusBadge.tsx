import { Badge } from "@/components/ui/badge";
import { RoundStatus } from "@/lib/features/participant/types";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-blue-100 text-blue-800" },
  eliminated: { label: "Eliminated", color: "bg-red-100 text-red-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  winner: { label: "Winner", color: "bg-yellow-100 text-yellow-800" },

  not_started: { label: "Not Started", color: "bg-gray-100 text-gray-800" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  submitted: { label: "Submitted", color: "bg-purple-100 text-purple-800" },
  under_review: {
    label: "Under Review",
    color: "bg-orange-100 text-orange-800",
  },
  passed: { label: "Passed", color: "bg-green-100 text-green-800" },
  failed: { label: "Failed", color: "bg-red-100 text-red-800" },
};

interface RoundStatusBadgeProps {
  status: RoundStatus | "winner" | "eliminated" | "completed" | "active";
  isSmall?: boolean;
}

export const RoundStatusBadge = ({
  status,
  isSmall,
}: RoundStatusBadgeProps) => {
  const config = statusConfig[status] || {
    label: status,
    color: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge
      className={`${config.color} ${isSmall ? "text-xs px-1.5 py-0.5" : ""}`}
    >
      {config.label}
    </Badge>
  );
};
