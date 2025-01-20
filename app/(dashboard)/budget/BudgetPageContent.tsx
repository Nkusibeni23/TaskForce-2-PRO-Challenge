"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import BudgetList from "@/components/budget/BudgetList";
import CreateBudgetDialog from "@/components/budget/CreateBudgetDialog";
import type { Budget, BudgetFormData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BudgetPageContent() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const api = useApi();
  const { toast } = useToast();

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const response = await api.getBudgets();
      setBudgets(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch budgets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleCreateBudget = async (formData: BudgetFormData) => {
    try {
      const response = await api.createBudget(formData);
      if (response?.data) {
        setBudgets((prev) => [...prev, response.data]);
        setIsCreateDialogOpen(false);
        toast({
          title: "Success",
          description: "Budget created successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create budget.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBudget = async (budget: Budget) => {
    try {
      const updateData = {
        name: budget.name,
        amount: budget.amount,
        description: budget.description,
        limit: budget.limit,
        startDate: budget.startDate,
        endDate: budget.endDate,
        account:
          typeof budget.account === "string"
            ? budget.account
            : budget.account._id,
        category: budget.category
          ? typeof budget.category === "string"
            ? budget.category
            : budget.category._id
          : undefined,
      };

      const response = await api.updateBudget(budget._id, updateData);
      if (response?.data) {
        setBudgets((prev) =>
          prev.map((b) => (b._id === budget._id ? response.data : b))
        );
        toast({
          title: "Success",
          description: "Budget updated successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update budget.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBudget = async () => {
    if (!budgetToDelete) return;

    try {
      await api.deleteBudget(budgetToDelete);
      setBudgets((prev) =>
        prev.filter((budget) => budget._id !== budgetToDelete)
      );
      toast({
        title: "Success",
        description: "Budget deleted successfully.",
      });
      setIsConfirmationDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete budget.",
        variant: "destructive",
      });
    }
  };

  const openConfirmationDialog = (budgetId: string) => {
    setBudgetToDelete(budgetId);
    setIsConfirmationDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground">
            Manage your budgets effectively.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <BudgetList
        budgets={budgets}
        onDelete={openConfirmationDialog}
        onUpdate={handleUpdateBudget}
        isLoading={isLoading}
      />
      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this budget? This action will remove
            the budget and return the remaining amount to the account.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBudget}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateBudgetDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateBudget}
      />
    </div>
  );
}
