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
  const [loading, setLoading] = useState<boolean>(true);
  const { getRecentExpenses, getRecentIncomes, getRecentBudgets } = useApi();

  useEffect(() => {
    const fetchRecentActivities = async () => {
      setLoading(true);
      try {
        const [expensesRes, incomesRes, budgetsRes] = await Promise.all([
          getRecentExpenses(5),
          getRecentIncomes(5),
          getRecentBudgets(5),
        ]);

        const expenses = expensesRes?.data?.expenses ?? [];
        const incomes = incomesRes?.data?.incomes ?? [];
        const budgets = budgetsRes?.data ?? [];

        const allActivities: Activity[] = [
          ...expenses.map((e: Transaction) => ({
            type: "expense" as const,
            data: e,
            timestamp: e.createdAt || new Date().toISOString(),
          })),
          ...incomes.map((i: Transaction) => ({
            type: "income" as const,
            data: i,
            timestamp: i.createdAt || new Date().toISOString(),
          })),
          ...budgets.map((b: Budget) => ({
            type: "budget" as const,
            data: b,
            timestamp: b.createdAt || new Date().toISOString(),
          })),
        ];

        setActivities(allActivities.slice(0, 10));
        setError(null);
      } catch (error) {
        setError("Failed to fetch recent activities.");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Recent Activity
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <ul className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className="animate-pulse flex items-center justify-between border-b pb-3"
            >
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {activities.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No recent activity found.
            </div>
          ) : (
            <ul className="space-y-4">
              {activities.map((activity, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "expense"
                          ? "bg-red-100 text-red-500"
                          : activity.type === "income"
                          ? "bg-green-100 text-green-500"
                          : "bg-blue-100 text-blue-500"
                      }`}
                    >
                      {activity.type === "expense" && "-"}
                      {activity.type === "income" && "+"}
                      {activity.type === "budget" && "$"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        {activity.type === "expense" &&
                          `New expense: ${
                            (activity.data as Transaction).title
                          }`}
                        {activity.type === "income" &&
                          `New income: ${(activity.data as Transaction).title}`}
                        {activity.type === "budget" &&
                          `New budget: ${(activity.data as Budget).name}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityFeed;
