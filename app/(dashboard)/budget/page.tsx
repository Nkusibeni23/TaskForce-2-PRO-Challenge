"use client";

import { Suspense } from "react";
import BudgetPageContent from "./BudgetPageContent";
import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetsPage() {
  return (
    <Suspense fallback={<BudgetsLoadingSkeleton />}>
      <BudgetPageContent />
    </Suspense>
  );
}

function BudgetsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
