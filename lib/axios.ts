import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import {
  type Account,
  type Transaction,
  type Category,
  type Budget,
  Expense,
  NewTransaction,
  ExpenseResponse,
  IncomeResponse,
  BudgetResponse,
} from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const useApi = () => {
  const { getToken } = useAuth();

  const apiWithAuth = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  apiWithAuth.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    // Accounts
    createAccount: async (data: {
      name: string;
      type: string;
      balance: number;
    }) => {
      const response = await apiWithAuth.post<Account>("/add-account", data);
      return response.data;
    },

    getAccounts: async () => {
      const response = await apiWithAuth.get<Account[]>("/get-accounts");
      return response.data;
    },

    getAccountById: async (id: string) => {
      const response = await apiWithAuth.get<Account>(`/get-account/${id}`);
      return response.data;
    },

    updateAccount: async (
      id: string,
      data: { name?: string; type?: string; balance?: number }
    ) => {
      const response = await apiWithAuth.put<Account>(
        `/update-account/${id}`,
        data
      );
      return response.data;
    },

    deleteAccount: async (id: string) => {
      await apiWithAuth.delete(`/delete-account/${id}`);
    },

    // Transactions
    createTransaction: async (data: {
      amount: number;
      type: "income" | "expense";
      account: string;
      category?: string;
      description?: string;
      date?: string;
    }) => {
      const response = await apiWithAuth.post<Transaction>(
        "/add-transaction",
        data
      );
      return response.data;
    },

    getTransactions: async (params?: {
      startDate?: string;
      endDate?: string;
      type?: "income" | "expense";
      account?: string;
      category?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await apiWithAuth.get<{
        transactions: Transaction[];
        pagination: {
          total: number;
          pages: number;
          currentPage: number;
          perPage: number;
        };
      }>("/get-transactions", { params });
      return response.data;
    },

    getTransactionById: async (id: string) => {
      const response = await apiWithAuth.get<Transaction>(
        `/get-transaction/${id}`
      );
      return response.data;
    },

    deleteTransaction: async (id: string) => {
      await apiWithAuth.delete(`/delete-transaction/${id}`);
    },

    // Categories
    createCategory: async (data: { name: string; parentCategory?: string }) => {
      const response = await apiWithAuth.post<Category>("/add-category", data);
      return response.data;
    },

    getCategories: async () => {
      const response = await apiWithAuth.get<Category[]>("/get-categories", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "clerk-token": await getToken(),
        },
      });
      return response.data;
    },

    getCategoryById: async (id: string) => {
      const response = await apiWithAuth.get<Category>(`/get-category/${id}`);
      return response.data;
    },

    updateCategory: async (
      id: string,
      data: { name?: string; parentCategory?: string }
    ) => {
      const response = await apiWithAuth.put<Category>(
        `/update-categories/${id}`,
        data
      );
      return response.data;
    },

    deleteCategory: async (id: string) => {
      await apiWithAuth.delete(`/delete-categories/${id}`);
    },

    // budget
    createBudget: async (data: {
      name: string;
      amount: number;
      account: string;
      category?: string;
      description?: string;
      limit: number;
      startDate: string;
      endDate: string;
    }) => {
      const response = await apiWithAuth.post("/add-budget", data);
      return response.data;
    },

    getBudgets: async () => {
      const response = await apiWithAuth.get<{
        message: string;
        data: Budget[];
      }>("/get-budgets");
      return response.data;
    },

    getAllBudgets: async () => {
      const response = await apiWithAuth.get("/get-all-budgets");
      return response.data;
    },

    updateBudget: async (id: string, data: Partial<Budget>) => {
      const response = await apiWithAuth.put(`/update-budget/${id}`, data);
      return response.data;
    },

    deleteBudget: async (id: string) => {
      const response = await apiWithAuth.delete(`/delete-budget/${id}`);
      return response.data;
    },

    updateBudgetSpending: async (budgetId: string, amount: number) => {
      const response = await apiWithAuth.post(`/budgets/${budgetId}/spending`, {
        amount,
      });
      return response.data;
    },

    checkExpiredBudgets: async () => {
      const response = await apiWithAuth.post("/budgets/check-expired");
      return response.data;
    },

    // Expenses
    createExpense: async (data: NewTransaction) => {
      const response = await apiWithAuth.post<Expense>("/add-expense", data);
      return response.data;
    },

    getExpenses: async (params?: {
      startDate?: string;
      endDate?: string;
      category?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await apiWithAuth.get<ExpenseResponse>("/get-expenses", {
        params,
      });
      return response.data;
    },

    deleteExpense: async (id: string) => {
      await apiWithAuth.delete(`/delete-expense/${id}`);
    },

    // Incomes
    createIncome: async (data: NewTransaction) => {
      const response = await apiWithAuth.post<Transaction>("/add-income", data);
      return response.data;
    },

    getIncomes: async (params?: {
      startDate?: string;
      endDate?: string;
      category?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await apiWithAuth.get<IncomeResponse>("/get-incomes", {
        params,
      });
      return response.data;
    },

    deleteIncome: async (id: string) => {
      await apiWithAuth.delete(`/delete-income/${id}`);
    },

    // Recent Feed
    getRecentExpenses: async (limit = 10) => {
      const response = await apiWithAuth.get<ExpenseResponse>("/get-expenses", {
        params: { limit },
      });
      return response.data;
    },

    getRecentIncomes: async (limit = 10) => {
      const response = await apiWithAuth.get<IncomeResponse>("/get-incomes", {
        params: { limit },
      });
      return response.data;
    },

    getRecentBudgets: async (limit = 10) => {
      const response = await apiWithAuth.get<BudgetResponse>("/get-budgets", {
        params: { limit },
      });
      return response.data;
    },
    
    // Reports
    getTransactionReport: async (params: {
      startDate: string;
      endDate: string;
      type?: "income" | "expense";
      category?: string;
    }) => {
      const response = await apiWithAuth.get("/reports/transactions", {
        params,
      });
      return response.data;
    },
  };
};
