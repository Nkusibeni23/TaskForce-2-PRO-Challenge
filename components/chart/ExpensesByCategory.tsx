"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useApi } from "@/lib/axios";
import { Category, ChartData, Expense } from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpensesByCategory: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Expenses by Category",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const { getExpenses, getCategories } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expensesResponse = await getExpenses();
        const categoriesResponse = await getCategories();

        // Extract the array of expenses from the response
        const expenses: Expense[] = expensesResponse.data;
        const categories: Category[] = categoriesResponse;

        const expensesByCategory: { [key: string]: number } = {};
        expenses.forEach((expense) => {
          if (expensesByCategory[expense.category]) {
            expensesByCategory[expense.category] += expense.amount;
          } else {
            expensesByCategory[expense.category] = expense.amount;
          }
        });

        const labels = categories.map((category) => category.name);
        const data = categories.map(
          (category) => expensesByCategory[category._id] || 0
        );

        setChartData({
          labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-2">
      <div className="max-w-lg mx-auto">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ExpensesByCategory;
