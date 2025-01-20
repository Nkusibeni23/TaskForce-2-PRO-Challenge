"use client";

import { useToast } from "@/components/ui/use-toast";
import TransactionForm from "@/components/transaction/TransactionForm";
import TransactionList from "@/components/transaction/TransactionList";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionPageClientProps {
  expenses: any[];
  incomes: any[];
  categories: any[];
  budgets: any[];
  accounts: any[];
}

export default function TransactionPageClient({
  expenses,
  incomes,
  categories,
  budgets,
  accounts,
}: TransactionPageClientProps) {
  const { toast } = useToast();

  const handleCreateTransaction = async (newTransaction: any) => {
    try {
      const { createExpense, createIncome } = require("@/lib/axios");

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
      const { deleteTransaction, deleteIncome } = require("@/lib/axios");

      if (type === "expense") {
        await deleteTransaction(id);
      } else {
        await deleteIncome(id);
      }

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

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Transactions</h1>
      <Card>
        <TransactionForm onCreateTransaction={handleCreateTransaction} />
      </Card>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Expense History</h2>
        {expenses.length === 0 ? (
          <Skeleton className="h-24 w-full rounded-md mb-4" />
        ) : (
          <TransactionList
            transactions={expenses}
            categories={categories}
            budgets={budgets}
            onDeleteTransaction={(id) => handleDeleteTransaction(id, "expense")}
          />
        )}
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Income History</h2>
        {incomes.length === 0 ? (
          <Skeleton className="h-24 w-full rounded-md mb-4" />
        ) : (
          <TransactionList
            transactions={incomes}
            categories={categories}
            accounts={accounts}
            onDeleteTransaction={(id) => handleDeleteTransaction(id, "income")}
          />
        )}
      </div>
    </div>
  );
}
