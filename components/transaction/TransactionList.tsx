"use client";

import React from "react";
import TransactionItem from "./TransactionItem";
import { Transaction, Category, Budget, Account } from "@/lib/types";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  budgets?: Budget[];
  accounts?: Account[];
  onDeleteTransaction: (id: string, type: "income" | "expense") => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  budgets,
  accounts,
  onDeleteTransaction,
}) => {
  if (!transactions || transactions.length === 0) {
    return <div>No transactions to display.</div>;
  }

  const getCategoryName = (id: string) =>
    categories.find((c) => c._id === id)?.name ?? "Unknown Category";
  const getBudgetName = (id: string) =>
    budgets?.find((b) => b._id === id)?.name ?? "Unknown Budget";
  const getAccountName = (id: string) =>
    accounts?.find((a) => a._id === id)?.name ?? "Unknown Account";
  return (
    <div className="space-y-4 mt-4">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction._id}
          transaction={transaction}
          categoryName={getCategoryName(transaction.category)}
          budgetName={
            transaction.budget ? getBudgetName(transaction.budget) : undefined
          }
          accountName={
            transaction.account
              ? getAccountName(transaction.account)
              : undefined
          }
          onDelete={() =>
            onDeleteTransaction(transaction._id, transaction.type)
          }
        />
      ))}
    </div>
  );
};

export default TransactionList;
