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
  userId: string;
  name: string;
  parentCategory?: string | Category;
  type: "income" | "expense" | "both";
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesListProps {
  categories: Category[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    data: { name: string; parentCategory?: string }
  ) => void;
}

export interface AccountsListProps {
  accounts: Account[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; parentCategory?: string }) => void;
  categories: Category[];
}

export interface ExtendedAccountsListProps extends AccountsListProps {
  onUpdate: (
    id: string,
    data: { name: string; type: string; balance: number }
  ) => void;
}
