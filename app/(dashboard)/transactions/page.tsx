"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/axios";
import {
  Account,
  Budget,
  Category,
  NewTransaction,
  Transaction,
} from "@/lib/types";
import TransactionForm from "@/components/transaction/TransactionForm";
import TransactionList from "@/components/transaction/TransactionList";
import { useToast } from "@/components/ui/use-toast";

export default function TransactionPage() {
  const {
    getExpenses,
    deleteTransaction,
    createExpense,
    createIncome,
    getIncomes,
    deleteIncome,
    getCategories,
    getBudgets,
    getAccounts,
  } = useApi();
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const [
        expenseData,
        incomeData,
        categoriesData,
        budgetsData,
        accountsData,
      ] = await Promise.all([
        getExpenses({ page: 1, limit: 10 }),
        getIncomes({ page: 1, limit: 10 }),
        getCategories(),
        getBudgets(),
        getAccounts(),
      ]);

      setExpenses(expenseData.data.expenses);
      setIncomes(incomeData.data.incomes);
      setCategories(categoriesData);
      setBudgets(budgetsData.data);
      setAccounts(accountsData);
    } catch (err) {
      console.error("Error fetching data", err);
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: "An error occurred while fetching data. Please try again.",
      });
    }
    setLoading(false);
  };

  const handleCreateTransaction = async (newTransaction: NewTransaction) => {
    try {
      if (newTransaction.type === "expense") {
        await createExpense(newTransaction);
        toast({
          title: "Expense created",
          description: "Your expense has been successfully added.",
        });
      } else {
        await createIncome(newTransaction);
        toast({
          title: "Income created",
          description: "Your income has been successfully added.",
        });
      }
      fetchTransactions();
    } catch (error) {
      console.error("Error creating transaction", error);
      toast({
        variant: "destructive",
        title: "Error creating transaction",
      });
    }
  };

  const handleDeleteTransaction = async (
    id: string,
    type: "income" | "expense"
  ) => {
    try {
      if (type === "expense") {
        await deleteTransaction(id);
      } else {
        await deleteIncome(id);
      }
      fetchTransactions();
      toast({
        title: "Transaction deleted",
        description: "The transaction has been successfully deleted.",
      });
    } catch (err) {
      console.error("Error deleting transaction", err);
      toast({
        variant: "destructive",
        title: "Error deleting transaction",
        description:
          "An error occurred while deleting the transaction. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Transactions</h1>
      <Card>
        <TransactionForm onCreateTransaction={handleCreateTransaction} />
      </Card>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Expense History</h2>
        {loading ? (
          <Skeleton className="h-24 w-full rounded-md mb-4" />
        ) : (
          <TransactionList
            transactions={expenses}
            categories={categories}
            budgets={budgets}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Income History</h2>
        {loading ? (
          <Skeleton className="h-24 w-full rounded-md mb-4" />
        ) : (
          <TransactionList
            transactions={incomes}
            categories={categories}
            accounts={accounts}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
      </div>
    </div>
  );
}
