"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetPageContent() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const api = useApi();
  const { toast } = useToast();

  type ApiError = {
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  const fetchBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.getBudgets();
      setBudgets(response.data);
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError)?.response?.data?.message ??
        "Failed to fetch budgets.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [api, toast]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

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
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to create budget.";
      toast({
        title: "Error",
        description: errorMessage,
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
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to delete budget.";
      toast({
        title: "Error",
        description: errorMessage,
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

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <BudgetList
          budgets={budgets}
          onDelete={openConfirmationDialog}
          isLoading={isLoading}
          onUpdate={function (budget: Budget): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}

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
            Are you sure you want to delete this budget? This action cannot be
            undone.
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
