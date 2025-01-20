import FinancialOverview from "@/components/chart/FinancialOverview";
import ActivityFeed from "@/components/feed/ActivityFeed";
import React from "react";

function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Financial Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <FinancialOverview />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
