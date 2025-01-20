"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Category } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { CategoriesList } from "@/components/manage/CategoriesList";
import { CreateCategoryDialog } from "@/components/manage/CreateCategoryDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const api = useApi();
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (data: {
    name: string;
    parentCategory?: string;
  }) => {
    try {
      const newCategory = await api.createCategory(data);
      setCategories((prev) => [...prev, newCategory]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (
    id: string,
    data: { name: string; parentCategory?: string }
  ) => {
    try {
      const updatedCategory = await api.updateCategory(id, data);
      setCategories((prev) =>
        prev.map((category) =>
          category._id === id ? updatedCategory : category
        )
      );
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category._id !== id));
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage your categories.</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <CategoriesList
          categories={categories}
          isLoading={isLoading}
          onDelete={handleDeleteCategory}
          onUpdate={handleUpdateCategory}
        />
      )}

      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateCategory}
        categories={categories}
      />
    </div>
  );
}
