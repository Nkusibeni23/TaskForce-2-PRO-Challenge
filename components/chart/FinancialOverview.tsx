"use client";

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useApi } from "@/lib/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

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
      const incomesResponse = await getIncomes();
      const expensesResponse = await getExpenses();

      const incomes = incomesResponse.data.incomes;
      const expenses = expensesResponse.data.expenses;

      const totalIncome = incomes.reduce(
        (sum, income) => sum + income.amount,
        0
      );
      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      setChartData({
        ...chartData,
        datasets: [
          {
            ...chartData.datasets[0],
            data: [totalIncome, totalExpenses],
          },
        ],
      });
    };

    fetchData();
  }, []);

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
