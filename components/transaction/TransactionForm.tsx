"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account, Budget, Category, NewTransaction } from "@/lib/types";
import { useApi } from "@/lib/axios";

interface TransactionFormProps {
  onCreateTransaction: (transaction: NewTransaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onCreateTransaction,
}) => {
  const { getCategories, getBudgets, getAccounts } = useApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    title: "",
    amount: 0,
    type: "expense",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    budget: "",
    account: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
    fetchAccounts();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
      setError("Failed to load categories.");
    }
  };

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data.data);
    } catch (error) {
      console.error("Error fetching budgets", error);
      setError("Failed to load budgets.");
    }
  };

  const fetchAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts", error);
      setError("Failed to load accounts.");
    }
  };

  const handleSubmit = () => {
    if (!newTransaction.category) {
      setError("Please select a category.");
      return;
    }
    if (newTransaction.type === "expense" && !newTransaction.budget) {
      setError("Please select a budget for expenses.");
      return;
    }
    if (newTransaction.type === "income" && !newTransaction.account) {
      setError("Please select an account for income.");
      return;
    }

    setError(null); // Clear any existing error
    onCreateTransaction(newTransaction);

    setNewTransaction({
      title: "",
      amount: 0,
      type: "expense",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      budget: "",
      account: "",
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium">Create Transaction</h2>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <Select
            onValueChange={(value) =>
              setNewTransaction({
                ...newTransaction,
                type: value as "income" | "expense",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            type="text"
            value={newTransaction.title}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, title: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <Input
            type="number"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: +e.target.value })
            }
          />
        </div>
        {/* Category selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <Select
            onValueChange={(value) =>
              setNewTransaction({ ...newTransaction, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        {/* Conditional budget field */}
        {newTransaction.type === "expense" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Budget
            </label>
            <Select
              value={newTransaction.budget}
              onValueChange={(value) =>
                setNewTransaction({ ...newTransaction, budget: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a budget" />
              </SelectTrigger>
              <SelectContent>
                {budgets.length > 0 ? (
                  budgets.map((budget) => (
                    <SelectItem key={budget._id} value={budget._id}>
                      {budget.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No budgets available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
        {/* Account selection for income */}
        {newTransaction.type === "income" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account
            </label>
            <Select
              value={newTransaction.account}
              onValueChange={(value) =>
                setNewTransaction({ ...newTransaction, account: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <SelectItem key={account._id} value={account._id}>
                      {account.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No accounts available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Input
            type="text"
            value={newTransaction.description}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                description: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <Input
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
          />
        </div>
        <Button onClick={handleSubmit}>Add Transaction</Button>
      </div>
    </div>
  );
};

export default TransactionForm;
