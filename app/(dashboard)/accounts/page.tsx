"use client";

import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Account } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateAccountDialog from "@/components/accounts/CreateAccountDialog";
import AccountsList from "@/components/accounts/AccountsList";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const api = useApi();
  const { toast } = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getAccounts();
      setAccounts(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch accounts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleCreateAccount = async (data: {
    name: string;
    type: string;
    balance: number;
  }) => {
    try {
      const newAccount = await api.createAccount(data);
      setAccounts((prev) => [...prev, newAccount]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAccount = async (
    id: string,
    data: { name: string; type: string; balance: number }
  ) => {
    try {
      const updatedAccount = await api.updateAccount(id, data);
      setAccounts((prev) =>
        prev.map((account) => (account._id === id ? updatedAccount : account))
      );
      toast({
        title: "Success",
        description: "Account updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update account",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await api.deleteAccount(id);
      setAccounts((prev) => prev.filter((account) => account._id !== id));
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
          <p className="text-muted-foreground">
            Manage your accounts and track your balances
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalBalance.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      ) : (
        <AccountsList
          accounts={accounts}
          isLoading={isLoading}
          onDelete={handleDeleteAccount}
          onUpdate={handleUpdateAccount}
        />
      )}

      <CreateAccountDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAccount}
      />
    </div>
  );
}
