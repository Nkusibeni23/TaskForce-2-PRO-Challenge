import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { CategoriesListProps, Category } from "@/lib/types";
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
import { UpdateCategoryDialog } from "./UpdateCategoryDialog";

export function CategoriesList({
  categories,
  isLoading,
  onDelete,
  onUpdate,
}: CategoriesListProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleUpdateClick = (category: Category) => {
    setSelectedCategory(category);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdate = (data: { name: string; parentCategory?: string }) => {
    if (selectedCategory) {
      onUpdate(selectedCategory._id, data);
      setSelectedCategory(null);
      setIsUpdateDialogOpen(false);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Parent Category</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                <div className="flex items-center justify-center space-x-2">
                  Loading...
                </div>
              </TableCell>
            </TableRow>
          ) : categories.length ? (
            categories.map((category: Category) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  {category.parentCategory
                    ? typeof category.parentCategory === "object"
                      ? category.parentCategory.name
                      : categories.find(
                          (c: Category) => c._id === category.parentCategory
                        )?.name ?? "None"
                    : "None"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateClick(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(category._id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                <div className="text-muted-foreground">No categories found</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedCategory && (
        <UpdateCategoryDialog
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onSubmit={handleUpdate}
          category={selectedCategory}
          categories={categories}
        />
      )}
    </div>
  );
}
