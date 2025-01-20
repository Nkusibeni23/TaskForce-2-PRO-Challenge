"use client";

import { useState } from "react";
import { ExtendedAccountsListProps, Account } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UpdateAccountDialog from "./UpdateAccountDialog";

export default function AccountsList({
  accounts,
  isLoading,
  onDelete,
  onUpdate,
}: Readonly<ExtendedAccountsListProps>) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleUpdateClick = (account: Account) => {
    setSelectedAccount(account);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdate = (data: {
    name: string;
    type: string;
    balance: number;
  }) => {
    if (selectedAccount) {
      onUpdate(selectedAccount._id, data);
      setSelectedAccount(null);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="flex justify-center items-center space-x-2">
                  <span>Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : accounts && accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-muted-foreground">
                    No accounts available.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            accounts?.map((account) => (
              <TableRow key={account._id}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell className="capitalize">{account.type}</TableCell>
                <TableCell className="text-right">
                  ${account.balance.toLocaleString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateClick(account)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this account? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(account._id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedAccount && (
        <UpdateAccountDialog
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onSubmit={handleUpdate}
          account={selectedAccount}
        />
      )}
    </div>
  );
}
