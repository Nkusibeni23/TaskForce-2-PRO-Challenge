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
  title: string;
  amount: number;
  description?: string;
  type: "income" | "expense";
  budget?: string;
  account?: string;
  category: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewTransaction {
  title: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  description: string;
  date: string;
  budget?: string;
  account?: string;
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

export interface PopulatedAccount {
  _id: string;
  name: string;
}

export interface PopulatedCategory {
  _id: string;
  name: string;
}

export interface Budget {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  description?: string;
  limit: number;
  account: string | PopulatedAccount;
  category?: string | PopulatedCategory;
  startDate: string;
  endDate: string;
  currentSpending: number;
  notificationsSent: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Expense = {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  budget: string;
  createdAt: string;
  updatedAt: string;
};

export interface BudgetListProps {
  budgets: Budget[];
  onDelete: (id: string) => void;
  onUpdate: (budget: Budget) => void;
}

export interface BudgetFormData {
  name: string;
  amount: number;
  description?: string;
  account: string;
  category?: string;
  limit: number;
  startDate: string;
  endDate: string;
}

export interface BudgetApiResponse {
  message: string;
  data: Budget[];
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

export interface ExpenseResponse {
  data: {
    expenses: Transaction[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      perPage: number;
    };
  };
}

export interface IncomeResponse {
  data: {
    incomes: Transaction[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      perPage: number;
    };
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}
