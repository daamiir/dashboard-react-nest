import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "../types";
import { categorySchema, type CategoryFormValues } from "../schema";
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories";
import { flattenCategories, getDescendantIds, slugify } from "../utils";

// Select needs a non-empty value for "no parent"
const NONE = "none";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  category: Category | null;
}

export const CategoryDialog = ({
  open,
  onOpenChange,
  categories,
  category,
}: Props) => {
  const isEdit = !!category;
  const create = useCreateCategory();
  const update = useUpdateCategory();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", parentId: null },
  });

  // Load values each time the dialog opens
  useEffect(() => {
    if (!open) return;
    reset({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      parentId: category?.parentId ?? null,
    });
  }, [open, category, reset]);

  // Hide self and descendants to avoid cycles
  const blocked = category ? getDescendantIds(categories, category.id) : [];
  const parentOptions = flattenCategories(categories).filter(
    (r) => !blocked.includes(r.category.id),
  );

  const onSubmit = (values: CategoryFormValues) => {
    const done = { onSuccess: () => onOpenChange(false) };
    if (category) update.mutate({ id: category.id, payload: values }, done);
    else create.mutate(values, done);
  };

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "Add category"}</DialogTitle>
          <DialogDescription>
            Categories group products and drive the specs form.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              {...register("name", {
                // Auto-fill slug on create until it is edited by hand
                onChange: (e) => {
                  if (!isEdit && !dirtyFields.slug) {
                    setValue("slug", slugify(e.target.value));
                  }
                },
              })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-slug">Slug</Label>
            <Input id="category-slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                Changing the slug can break the specs form for this category.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Parent category</Label>
            <Controller
              control={control}
              name="parentId"
              render={({ field }) => (
                <Select
                  value={field.value ?? NONE}
                  onValueChange={(v) => field.onChange(v === NONE ? null : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>No parent (top level)</SelectItem>
                    {parentOptions.map((r) => (
                      <SelectItem key={r.category.id} value={r.category.id}>
                        {"— ".repeat(r.depth) + r.category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
