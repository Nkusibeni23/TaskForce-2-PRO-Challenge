import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";

interface UpdateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; parentCategory?: string }) => void;
  category: Category;
  categories: Category[];
}

export function UpdateCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  category,
  categories,
}: UpdateCategoryDialogProps) {
  const [name, setName] = useState(category.name);
  const [parentCategory, setParentCategory] = useState(
    typeof category.parentCategory === "string"
      ? category.parentCategory
      : category.parentCategory?._id ?? ""
  );

  useEffect(() => {
    setName(category.name);
    setParentCategory(
      typeof category.parentCategory === "string"
        ? category.parentCategory
        : category.parentCategory?._id ?? ""
    );
  }, [category]);

  const handleSubmit = () => {
    onSubmit({
      name,
      parentCategory: parentCategory || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            Update the details of the category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parentCategory" className="text-right">
              Parent Category
            </Label>
            <select
              id="parentCategory"
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">None</option>
              {categories
                .filter((c) => c._id !== category._id)
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
