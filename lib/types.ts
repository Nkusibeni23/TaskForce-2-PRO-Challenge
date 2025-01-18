export interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  type: "income" | "expense";
  account: string | Account;
  category?: string | Category;
  description?: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  parentCategory?: string | Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountsListProps {
  accounts: Account[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export interface CreateAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: FormData) => void;
  }