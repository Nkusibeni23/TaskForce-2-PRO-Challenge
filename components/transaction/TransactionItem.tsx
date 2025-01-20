"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrashIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

interface TransactionItemProps {
  transaction: {
    _id: string;
    title: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    description?: string;
    date: string;
    budget?: string;
    account?: string;
  };
  categoryName: string;
  budgetName?: string;
  accountName?: string;
  onDelete: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  categoryName,
  budgetName,
  accountName,
  onDelete,
}) => {
  const isIncome = transaction.type === "income";

  return (
    <Card
      className={`flex justify-between items-center p-4 shadow-md border-l-4 ${
        isIncome ? "border-green-500" : "border-red-500"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`rounded-full p-2 ${
            isIncome ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isIncome ? (
            <TrendingUpIcon className="text-green-500 w-6 h-6" />
          ) : (
            <TrendingDownIcon className="text-red-500 w-6 h-6" />
          )}
        </div>
        <div>
          <h3 className="font-medium text-lg">{transaction.title}</h3>
          <p className="text-sm text-gray-500">
            Date: {new Date(transaction.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 font-medium">Category: {categoryName}</p>
          {transaction.description && (
            <p className="text-sm text-gray-400 mt-1">
              {transaction.description}
            </p>
          )}
          {budgetName && (
            <p className="text-sm text-gray-500 mt-1 font-semibold">
              Budget: {budgetName}
            </p>
          )}
          {accountName && (
            <p className="text-sm text-gray-500 mt-1 font-semibold">
              Account: {accountName}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <span
          className={`font-medium text-lg ${
            isIncome ? "text-green-600" : "text-red-600"
          }`}
        >
          ${transaction.amount.toFixed(2)}
        </span>
        <Button variant="destructive" onClick={onDelete}>
          <TrashIcon className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default TransactionItem;
