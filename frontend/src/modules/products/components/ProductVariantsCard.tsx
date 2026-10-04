import {
  useFormContext,
  useFieldArray,
  useController,
  useWatch,
  Controller,
} from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Trash2,
  Plus,
  Pencil,
  GripVertical,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { CollapseToggle } from "./CollapseToggle";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUploader } from "./ProductImagesCard";
import { FormInput } from "@/modules/auth/components/FormInput";
import { FormStepper } from "./FormStepper";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/modules/categories/hooks/useCategories";
import type { ProductFormValues } from "@/modules/products/schema";

export const VARIANT_SPECS: Record<string, { key: string; label: string }[]> = {
  smartphone: [
    { key: "color", label: "Color" },
    { key: "ram", label: "RAM (GB)" },
    { key: "storage", label: "Storage (GB)" },
  ],
};

type Spec = { key: string; label: string };

// Compact row title: color, RAM, storage
const variantLabel = (a: Record<string, unknown> = {}) =>
  [a.color, a.ram && `${a.ram}GB`, a.storage && `${a.storage}GB`]
    .filter(Boolean)
    .join(" \u00b7 ") || "New variant";

type Errors = Record<string, string>;

// Every spec must be filled: non-empty color, positive RAM and storage
export const validateSpecs = (
  a: Record<string, unknown> = {},
  specs: Spec[],
) => {
  const errors: Errors = {};
  if (specs.length === 0) errors._ = "Select a category first";
  for (const s of specs) {
    const v = a[s.key];
    const ok =
      s.key === "color" ? String(v ?? "").trim() !== "" : Number(v) > 0;
    if (!ok) errors[s.key] = `${s.label.split(" (")[0]} is required`;
  }
  return errors;
};

const inputCls =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-ring";
const NEW_COLOR = "__new__";

// Pick an existing color of this product or type a new one
const ColorField = ({
  index,
  colors,
  error,
}: {
  index: number;
  colors: string[];
  error?: string;
}) => {
  const { control } = useFormContext<ProductFormValues>();
  const { field } = useController({
    control,
    name: `variants.${index}.attributes.color`,
  });
  const current = String(field.value ?? "");
  const [adding, setAdding] = useState(
    current !== "" && !colors.includes(current),
  );

  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <select
        className={inputCls}
        value={adding ? NEW_COLOR : current}
        onChange={(e) => {
          const v = e.target.value;
          setAdding(v === NEW_COLOR);
          field.onChange(v === NEW_COLOR ? "" : v);
        }}
      >
        <option value="" disabled>
          Select color
        </option>
        <option value={NEW_COLOR}>+ New Color...</option>
        {colors.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {adding && (
        <input
          className={inputCls}
          placeholder="Color name"
          value={current}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

// Fields of one variant, shown inside the modal
const VariantForm = ({
  index,
  specs,
  colors,
  errors,
}: {
  index: number;
  specs: Spec[];
  colors: string[];
  errors: Errors;
}) => {
  const { control, setValue } = useFormContext<ProductFormValues>();
  const own = useWatch({ control, name: `variants.${index}.images` });
  const color = useWatch({
    control,
    name: `variants.${index}.attributes.color`,
  });
  const [custom, setCustom] = useState((own?.length ?? 0) > 0);

  return (
    <div className="space-y-4">
      {errors._ && <p className="text-sm text-destructive">{errors._}</p>}
      {specs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {specs.some((s) => s.key === "color") && (
            <ColorField index={index} colors={colors} error={errors.color} />
          )}
          {specs
            .filter((s) => s.key !== "color")
            .map((spec) => (
              <Controller
                key={spec.key}
                name={`variants.${index}.attributes.${spec.key}`}
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>{spec.label}</Label>
                    <input
                      type={spec.key === "color" ? "text" : "number"}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={(field.value as string | number) ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          spec.key === "color"
                            ? e.target.value
                            : e.target.valueAsNumber,
                        )
                      }
                    />
                    {errors[spec.key] && (
                      <p className="text-xs text-destructive">
                        {errors[spec.key]}
                      </p>
                    )}
                  </div>
                )}
              />
            ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <FormInput
          name={`variants.${index}.price`}
          label="Price ($)"
          type="number"
          min={0}
          step="0.01"
          placeholder="0.00"
        />
        <FormStepper
          name={`variants.${index}.stockQuantity`}
          label="Stock Quantity"
          min={0}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={custom}
          onChange={(e) => {
            setCustom(e.target.checked);
            // Unchecking clears the override so the variant inherits again
            if (!e.target.checked) setValue(`variants.${index}.images`, []);
          }}
        />
        Custom images for this variant
      </label>
      {custom ? (
        <ImageUploader name={`variants.${index}.images`} />
      ) : (
        <p className="text-xs text-muted-foreground">
          Uses the {String(color || "color")} images
        </p>
      )}
    </div>
  );
};

export const ProductVariantsCard = () => {
  const { control, getValues } = useFormContext<ProductFormValues>();
  const categoryId = useWatch({ control, name: "categoryId" });
  const { data: categories = [] } = useCategories();
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const variantSpecs = selectedCategory
    ? (VARIANT_SPECS[selectedCategory.slug] ?? [])
    : [];
  const { fields, append, remove, update, move } = useFieldArray({
    control,
    name: "variants",
  });
  const variants = useWatch({ control, name: "variants" });
  const colorImages = useWatch({ control, name: "colorImages" });
  const [open, setOpen] = useState(true);
  const [view, setView] = useState<"list" | "grid">("list");
  const [editing, setEditing] = useState<{
    index: number;
    isNew: boolean;
    snapshot: ProductFormValues["variants"][number];
  } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const openEdit = (index: number) => {
    setErrors({});
    // Snapshot lets Cancel restore the previous state
    setEditing({
      index,
      isNew: false,
      snapshot: structuredClone(getValues(`variants.${index}`)),
    });
  };

  const addVariant = () => {
    const blank = {
      sku: "",
      price: 0,
      stockQuantity: 0,
      images: [],
      attributes: {},
    };
    append(blank);
    setErrors({});
    setEditing({ index: fields.length, isNew: true, snapshot: blank });
  };

  // Cancel: drop a new variant or restore the edited one
  const cancel = () => {
    if (!editing) return;
    if (editing.isNew) remove(editing.index);
    else update(editing.index, editing.snapshot);
    setEditing(null);
  };

  // Save: block until all specs are filled
  const save = () => {
    if (!editing) return;
    const errs = validateSpecs(
      getValues(`variants.${editing.index}.attributes`),
      variantSpecs,
    );
    if (Object.keys(errs).length) return setErrors(errs);
    setEditing(null);
  };

  // Colors already used by the other variants of this product
  const colors = [
    ...new Set(
      [
        ...variants
          .filter((_, i) => i !== editing?.index)
          .map((v) => String(v.attributes?.color ?? "").trim()),
        ...colorImages.map((c) => c.color),
      ].filter(Boolean),
    ),
  ];

  return (
    <Card className="px-6 py-4 sm:px-6 rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-1">
          <CollapseToggle open={open} onToggle={() => setOpen(!open)} />
          <CardTitle>Product Variants</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border">
            <Button
              type="button"
              size="icon"
              variant={view === "list" ? "secondary" : "ghost"}
              aria-label="List view"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={view === "grid" ? "secondary" : "ghost"}
              aria-label="Card view"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addVariant}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Variant
          </Button>
        </div>
      </CardHeader>
      <CardContent className={cn("pt-6 space-y-6", !open && "hidden")}>
        <div
          className={
            view === "grid"
              ? "grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-2"
          }
        >
          {fields.map((field, index) => {
            const v = variants[index];
            const grip = (
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
            );
            const info = (
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {variantLabel(v?.attributes)}
                </div>
                <div className="text-xs text-muted-foreground">
                  ${v?.price ?? 0}
                  {" \u00b7 "}Stock {v?.stockQuantity ?? 0}
                  {v?.images?.length ? " \u00b7 Custom images" : ""}
                </div>
              </div>
            );
            const actions = (
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(index)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteIndex(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            );
            return (
              <div
                key={field.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== index)
                    move(dragIndex, index);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={cn(
                  "rounded-lg border p-3",
                  view === "list" ? "flex items-center gap-3" : "space-y-2",
                  dragIndex === index && "opacity-40",
                )}
              >
                {view === "list" ? (
                  <>
                    {grip}
                    <div className="min-w-0 flex-1">{info}</div>
                    {actions}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      {grip}
                      {actions}
                    </div>
                    {info}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <Dialog open={editing !== null} onOpenChange={(o) => !o && cancel()}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editing?.isNew ? "New variant" : "Edit variant"}
              </DialogTitle>
              <DialogDescription>
                Specs, price, stock and optional custom images
              </DialogDescription>
            </DialogHeader>
            {editing && (
              <VariantForm
                index={editing.index}
                specs={variantSpecs}
                colors={colors}
                errors={errors}
              />
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={cancel}>
                Cancel
              </Button>
              <Button type="button" onClick={save}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={deleteIndex !== null}
          onOpenChange={(o) => !o && setDeleteIndex(null)}
          title="Delete variant?"
          description={`${variantLabel(variants[deleteIndex ?? 0]?.attributes)} will be removed from this product.`}
          onConfirm={() => deleteIndex !== null && remove(deleteIndex)}
        />
      </CardContent>
    </Card>
  );
};
