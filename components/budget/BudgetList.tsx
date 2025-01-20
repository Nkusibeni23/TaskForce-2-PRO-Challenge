import { Budget, PopulatedAccount, PopulatedCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface BudgetListProps {
  budgets: Budget[];
  onDelete: (id: string) => void;
  onUpdate: (budget: Budget) => void;
  isLoading: boolean;
}

function BudgetSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col p-6 bg-muted rounded-xl"
        >
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BudgetList({
  budgets,
  onDelete,
  onUpdate,
  isLoading,
}: BudgetListProps) {
  if (isLoading) {
    return <BudgetSkeleton />;
  }

  if (!Array.isArray(budgets) || budgets.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className=" p-8 rounded-xl text-center shadow-lg max-w-md mx-auto">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m0 0h3m-3 0H9m9 4H3"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No budgets found</h3>
          <p className="text-sm">Add a budget to get started!</p>
        </div>
      </div>
    );
  }

  const calculateProgress = (currentSpending: number, limit: number) => {
    if (!limit) return 0;
    const progress = (currentSpending / limit) * 100;
    return Math.min(progress, 100);
  };

  const getAccountName = (account: string | PopulatedAccount | null) => {
    if (!account) return "No Account";
    return typeof account === "string" ? account : account.name;
  };

  const getCategoryName = (
    category: string | PopulatedCategory | null | undefined
  ) => {
    if (!category) return "Uncategorized";
    return typeof category === "string" ? category : category.name;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {budgets.map((budget) => (
        <div
          key={budget._id}
          role="region"
          aria-labelledby={`budget-${budget._id}-title`}
          className="relative flex flex-col p-6 bg-muted rounded-xl"
        >
          <div className="absolute top-4 right-4 flex gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate(budget)}
              aria-label={`Edit ${budget.name || "budget"}`}
              className="flex items-center gap-1 "
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button> */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(budget._id)}
              aria-label={`Delete ${budget.name || "budget"}`}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700"
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </div>

          <div className="space-y-4">
            <h3
              id={`budget-${budget._id}-title`}
              className="text-2xl font-bold"
            >
              {budget.name || "Unnamed Budget"}
            </h3>

            {/* Amount and Limit */}
            <div className="space-y-2">
              {budget.amount && (
                <p>
                  <span className="font-semibold">Budget Amount:</span> $
                  {budget.amount.toLocaleString()}
                </p>
              )}
              <p>
                <span className="font-semibold">Spending Limit:</span> $
                {budget.limit.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Current Spending:</span> $
                {budget.currentSpending.toLocaleString()}
              </p>
            </div>

            {/* Account and Category */}
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Account:</span>{" "}
                {getAccountName(budget.account)}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {getCategoryName(budget.category)}
              </p>
            </div>

            {/* Dates */}
            <div className="space-y-1">
              {budget.startDate && (
                <p>
                  <span className="font-semibold">Start:</span>{" "}
                  {format(new Date(budget.startDate), "MMM dd, yyyy")}
                </p>
              )}
              {budget.endDate && (
                <p>
                  <span className="font-semibold">End:</span>{" "}
                  {format(new Date(budget.endDate), "MMM dd, yyyy")}
                </p>
              )}
            </div>

            {/* Description */}
            {budget.description && (
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {budget.description}
              </p>
            )}

            {/* Progress Bar */}
            <div className="space-y-2 ">
              <Progress
                value={calculateProgress(budget.currentSpending, budget.limit)}
                className="h-3 bg-white"
              />
              <p className="text-sm">
                {budget.currentSpending.toLocaleString()} of{" "}
                {budget.limit.toLocaleString()} (
                {calculateProgress(
                  budget.currentSpending,
                  budget.limit
                ).toFixed(1)}
                %)
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
