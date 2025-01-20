import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/lib/axios";
import { Category } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import CustomLoader from "../shared/CustomLoader";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    amount: z.coerce.number().min(1, "Amount must be greater than 0"),
    description: z.string().optional(),
    limit: z.coerce.number().min(1, "Limit must be greater than 0"),
    account: z.string().min(1, "Account is required"),
    category: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.limit || !data.amount) return true;
      return data.limit <= data.amount;
    },
    {
      message: "Limit cannot exceed budget amount",
      path: ["limit"],
    }
  );

type FormData = z.infer<typeof formSchema>;

interface CreateBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
}

export default function CreateBudgetDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateBudgetDialogProps) {
  const { getAccounts, getCategories } = useApi();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
      description: "",
      limit: 0,
      account: "",
      category: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    },
  });

  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [accountsData, categoriesData] = await Promise.all([
          getAccounts(),
          getCategories(),
        ]);

        setAccounts(accountsData.map(({ _id, name }) => ({ id: _id, name })));
        setCategories(categoriesData);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load accounts and categories.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data if it hasn't been fetched yet
    if (open && !hasFetchedData) {
      fetchData();
      setHasFetchedData(true);
    }
  }, [open, hasFetchedData, getAccounts, getCategories, toast]);

  const handleSubmit = (values: FormData) => {
    const formattedValues = {
      ...values,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      amount: Number(values.amount),
      limit: Number(values.limit),
    };
    onSubmit(formattedValues);
  };

  const renderField = (
    name: keyof FormData,
    label: string,
    placeholder?: string,
    type: "text" | "number" | "date" = "text",
    isOptional = false
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}{" "}
            {isOptional && (
              <span className="text-muted-foreground text-sm">(Optional)</span>
            )}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className="w-full"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderSelectField = (
    name: keyof FormData,
    label: string,
    options: { value: string; label: string }[],
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value)}
            value={field.value ? String(field.value) : undefined}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options && options.length > 0 ? (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <p className="p-2 text-muted-foreground">
                  No options available
                </p>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Budget</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <CustomLoader />
              </div>
            ) : (
              <>
                {renderField("name", "Budget Name", "Enter budget name")}
                {renderField(
                  "amount",
                  "Amount",
                  "Enter budget amount",
                  "number"
                )}
                {renderSelectField(
                  "account",
                  "Account",
                  accounts.map((account) => ({
                    value: account.id,
                    label: account.name,
                  })),
                  "Select an account"
                )}

                {renderSelectField(
                  "category",
                  "Category",
                  categories.map((category) => ({
                    value: category._id,
                    label: category.name,
                  })),
                  "Select a category"
                )}

                {renderField("startDate", "Start Date", undefined, "date")}
                {renderField("endDate", "End Date", undefined, "date")}
                {renderField(
                  "description",
                  "Description",
                  "Enter description (if any)",
                  "text",
                  true
                )}
                {renderField("limit", "Limit", "Enter budget limit", "number")}
              </>
            )}
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
