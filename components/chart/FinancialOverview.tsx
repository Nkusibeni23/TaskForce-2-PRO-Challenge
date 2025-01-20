"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useApi } from "@/lib/axios";

const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});

const FinancialOverview: React.FC = () => {
  const [chartData, setChartData] = useState({
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  });

  const { getIncomes, getExpenses } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomesResponse = await getIncomes();
        const expensesResponse = await getExpenses();

        const totalIncome = incomesResponse.data.incomes.reduce(
          (sum, income) => sum + income.amount,
          0
        );
        const totalExpenses = expensesResponse.data.expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        setChartData((prev) => ({
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: [totalIncome, totalExpenses],
            },
          ],
        }));
      } catch (err) {
        console.error("Error fetching financial data:", err);
      }
    };

    fetchData();
  }, [getIncomes, getExpenses]);

  return (
    <div className="bg-white rounded-lg shadow-md p-2">
      <div className="max-w-lg mx-auto">
        <h2 className="text-lg font-semibold mb-2">Financial Overview</h2>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default FinancialOverview;
