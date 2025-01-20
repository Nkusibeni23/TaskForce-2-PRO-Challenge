"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/lib/axios";
import { Transaction, Budget } from "@/lib/types";

interface Activity {
  type: "expense" | "income" | "budget";
  data: Transaction | Budget;
  timestamp: string;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getRecentExpenses, getRecentIncomes, getRecentBudgets } = useApi();

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const [expenses, incomes, budgets] = await Promise.all([
          getRecentExpenses(5),
          getRecentIncomes(5),
          getRecentBudgets(5),
        ]);

        const allActivities: Activity[] = [
          ...expenses.map((e) => ({
            type: "expense" as const,
            data: e,
            timestamp: e.createdAt,
          })),
          ...incomes.map((i) => ({
            type: "income" as const,
            data: i,
            timestamp: i.createdAt,
          })),
          ...budgets.map((b) => ({
            type: "budget" as const,
            data: b,
            timestamp: b.createdAt,
          })),
        ];

        allActivities.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setActivities(allActivities.slice(0, 10));
      } catch (error) {
        setError("Failed to fetch recent activities.");
        console.error("Error fetching recent activities:", error);
        setActivities([]);
      }
    };

    fetchRecentActivities();
  }, []);
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {activities.length === 0 && !error && (
        <div className="text-gray-500">No recent activity found.</div>
      )}
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li key={index} className="flex items-center">
            <div className="flex-1">
              {activity.type === "expense" && (
                <span className="text-red-500">
                  New expense: {(activity.data as Transaction).title}
                </span>
              )}
              {activity.type === "income" && (
                <span className="text-green-500">
                  New income: {(activity.data as Transaction).title}
                </span>
              )}
              {activity.type === "budget" && (
                <span className="text-blue-500">
                  New budget: {(activity.data as Budget).name}
                </span>
              )}
            </div>
            <span className="text-gray-500 text-sm ml-4">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
