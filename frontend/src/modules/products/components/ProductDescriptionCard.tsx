import { useState } from "react";
import { cn } from "@/utils/cn";
import { CollapseToggle } from "./CollapseToggle";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import type { ProductFormValues } from "@/modules/products/schema";
import {
  CATEGORY_SPECS,
  type SpecField,
} from "@/modules/products/config/category-specs.config";
import { useCategories } from "@/modules/categories/hooks/useCategories";
import { generateSlug } from "@/lib/slugify";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

const SpecFieldInput = ({ field }: { field: SpecField }) => {
  const { register, control, formState } = useFormContext();
  const name = `attributes.${field.key}`;
  const error = (
    formState.errors.attributes as
      | Record<string, { message?: string }>
      | undefined
  )?.[field.key]?.message;

  if (field.type === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field: f }) => (
            <Checkbox
              id={name}
              checked={!!f.value}
              onCheckedChange={f.onChange}
            />
          )}
        />
        <Label htmlFor={name} className="font-normal">
          {field.label}
        </Label>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{field.label}</Label>
        <Controller
          name={name}
          control={control}
          render={({ field: f }) => (
            <Select value={f.value ?? ""} onValueChange={f.onChange}>
              <SelectTrigger id={name} className="w-full">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {field.label}
        {field.unit ? ` (${field.unit})` : ""}
      </Label>
      <input
        id={name}
        type={field.type === "number" ? "number" : "text"}
        step={field.type === "number" ? "any" : undefined}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
        {...register(name, {
          valueAsNumber: field.type === "number",
        })}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export const ProductDescriptionCard = () => {
  const [open, setOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { register, control, setValue, getValues } =
    useFormContext<ProductFormValues>();
  const categoryId = useWatch({ control, name: "categoryId" });
  const customSlug = useWatch({ control, name: "customSlug" });
  const name = useWatch({ control, name: "name" });
  const slug = useWatch({ control, name: "slug" });

  const autoSlug = generateSlug(name ?? "");
  const isManual = !!customSlug && slug !== autoSlug;

  const { data: categories = [] } = useCategories();

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const specs = selectedCategory
    ? (CATEGORY_SPECS[selectedCategory.slug] ?? [])
    : [];

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const applyAutoSlug = () => {
    setValue("customSlug", false);
    setValue("slug", "");
  };

  const handleCustomSlugChange = (checked: boolean) => {
    if (checked) {
      setValue("customSlug", true);
      if (!getValues("slug")) setValue("slug", autoSlug);
      return;
    }
    if (isManual) {
      setConfirmOpen(true);
      return;
    }
    applyAutoSlug();
  };

  return (
    <Card className="px-4 py-4 sm:px-6 rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <div className="flex items-center gap-1">
          <CollapseToggle open={open} onToggle={() => setOpen(!open)} />
          <CardTitle>Product Description</CardTitle>
        </div>
      </CardHeader>
      <CardContent className={cn("pt-6 space-y-6", !open && "hidden")}>
        <FormInput
          name="name"
          label="Product Name"
          placeholder="e.g. Apple iPhone 17 Pro"
        />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Controller
              name="customSlug"
              control={control}
              render={({ field: f }) => (
                <Checkbox
                  id="customSlug"
                  checked={!!f.value}
                  onCheckedChange={(v) => handleCustomSlugChange(!!v)}
                />
              )}
            />
            <Label htmlFor="customSlug" className="font-normal">
              Custom slug
            </Label>
          </div>
          {customSlug && (
            <div className="space-y-1">
              <FormInput
                name="slug"
                label="Slug"
                placeholder="e.g. apple-iphone-17-pro"
              />
            </div>
          )}
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Use generated slug?"
          description="The slug you entered will be replaced by one generated from the product name."
          confirmLabel="Confirm"
          onConfirm={applyAutoSlug}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {categories.length > 0 && (
            <FormSelect
              name="categoryId"
              label="Category"
              options={categoryOptions}
            />
          )}
          <FormInput
            name="brand"
            label="Brand"
            placeholder="e.g. Apple, Samsung, Xiaomi"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Short product description…"
            rows={4}
            {...register("description")}
          />
        </div>

        {specs.length > 0 && (
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-sm font-semibold">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {specs
                .filter((f) => f.type !== "boolean")
                .map((field) => (
                  <SpecFieldInput key={field.key} field={field} />
                ))}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              {specs
                .filter((f) => f.type === "boolean")
                .map((field) => (
                  <SpecFieldInput key={field.key} field={field} />
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
