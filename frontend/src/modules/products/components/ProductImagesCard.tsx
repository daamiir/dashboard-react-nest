import { useState } from "react";
import { Loader2, Plus, Trash2, UploadCloud, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";
import { CollapseToggle } from "./CollapseToggle";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProductFormValues } from "@/modules/products/schema";
import { uploadImage } from "@/modules/products/api/uploads.api";
import { ConfirmDialog } from "./ConfirmDialog";

type ImagesFieldName =
  | `variants.${number}.images`
  | `colorImages.${number}.images`;

// Upload dropzone bound to any images field, stores Cloudinary URLs
export const ImageUploader = ({ name }: { name: ImagesFieldName }) => {
  const { control } = useFormContext<ProductFormValues>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const reorder = (
    urls: string[],
    from: number,
    to: number,
    onChange: (urls: string[]) => void,
  ) => {
    if (from === to) return;
    const next = [...urls];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const upload = async (
    files: FileList | null,
    current: string[],
    onChange: (urls: string[]) => void,
  ) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadImage));
      onChange([...current, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="space-y-4">
          <label
            htmlFor={`images-${name}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              upload(e.dataTransfer.files, field.value, field.onChange);
            }}
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg py-12 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="rounded-full border p-3">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <UploadCloud className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-center">
              <span className="font-medium text-foreground">
                Click to upload
              </span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP or GIF (max 5MB)
            </p>
            <input
              id={`images-${name}`}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.gif"
              multiple
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                upload(e.target.files, field.value, field.onChange);
                e.target.value = ""; // allow re-selecting the same file
              }}
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {field.value.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {field.value.map((url, i) => (
                <div
                  key={url}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null) setOverIndex(i);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null)
                      reorder(field.value, dragIndex, i, field.onChange);
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className={`relative aspect-square rounded-md overflow-hidden border group cursor-grab active:cursor-grabbing ${
                    dragIndex === i ? "opacity-40" : ""
                  } ${overIndex === i && dragIndex !== i ? "ring-2 ring-primary" : ""}`}
                >
                  <img
                    src={url}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                      Main
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      field.onChange(field.value.filter((_, j) => j !== i))
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    />
  );
};

export const ProductImagesCard = () => {
  const { control, setValue } = useFormContext<ProductFormValues>();
  const variants = useWatch({ control, name: "variants" });
  const colorImages = useWatch({ control, name: "colorImages" });
  const [openColor, setOpenColor] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string[]>([]);
  const [clearColor, setClearColor] = useState<string | null>(null);
  const [newColor, setNewColor] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const variantColors = variants
    .map((v) => String(v.attributes?.color ?? "").trim())
    .filter(Boolean);
  // Colors from variants plus colors created with New Color
  const colors = [
    ...new Set([...variantColors, ...colorImages.map((c) => c.color)]),
  ];
  const isUsed = (c: string) => variantColors.includes(c);

  const idx = openColor
    ? colorImages.findIndex((ci) => ci.color === openColor)
    : -1;

  const openEditor = (color: string) => {
    if (!colorImages.some((ci) => ci.color === color))
      setValue("colorImages", [...colorImages, { color, images: [] }]);
    setSnapshot(colorImages.find((ci) => ci.color === color)?.images ?? []);
    setOpenColor(color);
  };
  const cancel = () => {
    if (idx !== -1) {
      if (!isUsed(openColor!) && snapshot.length === 0)
        setValue(
          "colorImages",
          colorImages.filter((_, i) => i !== idx),
        );
      else setValue(`colorImages.${idx}.images`, snapshot);
    }
    setOpenColor(null);
  };
  const clearImages = () => {
    const i = colorImages.findIndex((ci) => ci.color === clearColor);
    if (i === -1) return;
    if (clearColor && !isUsed(clearColor))
      setValue(
        "colorImages",
        colorImages.filter((_, j) => j !== i),
      );
    else setValue(`colorImages.${i}.images`, []);
  };

  const createColor = () => {
    const name = (newColor ?? "").trim();
    if (!name) return;
    const existing = colors.find((c) => c.toLowerCase() === name.toLowerCase());
    setNewColor(null);
    openEditor(existing ?? name);
  };

  return (
    <Card className="px-6 py-4 sm:px-6 rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-1">
          <CollapseToggle open={open} onToggle={() => setOpen(!open)} />
          <CardTitle>Color Images</CardTitle>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setNewColor("")}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Color
        </Button>
      </CardHeader>
      <CardContent className={cn("pt-6", !open && "hidden")}>
        {colors.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No colors yet. Add a variant color or press New Color.
          </p>
        )}
        <div className="divide-y rounded-lg border empty:hidden">
          {colors.map((color) => {
            const images =
              colorImages.find((ci) => ci.color === color)?.images ?? [];
            return (
              <div
                key={color}
                className="flex items-center gap-1 pr-2 hover:bg-muted/50"
              >
                <button
                  type="button"
                  onClick={() => openEditor(color)}
                  className="flex flex-1 items-center gap-3 p-3 text-left"
                >
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded border border-dashed" />
                  )}
                  <span className="flex-1 text-sm font-medium">{color}</span>
                  {!isUsed(color) && (
                    <span className="text-xs text-amber-600">
                      No variant yet
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {images.length} images
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={images.length === 0 && isUsed(color)}
                  onClick={() => setClearColor(color)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            );
          })}
        </div>

        <Dialog open={idx !== -1} onOpenChange={(o) => !o && cancel()}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{openColor} images</DialogTitle>
              <DialogDescription>
                Shared by all variants of this color
              </DialogDescription>
            </DialogHeader>
            {idx !== -1 && <ImageUploader name={`colorImages.${idx}.images`} />}
            <DialogFooter className="sticky bottom-0">
              <Button type="button" variant="outline" onClick={cancel}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setOpenColor(null)}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={clearColor !== null}
          onOpenChange={(o) => !o && setClearColor(null)}
          title={
            clearColor && !isUsed(clearColor)
              ? "Delete color?"
              : "Delete all images?"
          }
          description={
            clearColor && !isUsed(clearColor)
              ? `${clearColor} and its images will be removed.`
              : `All ${clearColor ?? ""} images will be removed. Variants of this color will have no images.`
          }
          onConfirm={clearImages}
        />
        <Dialog
          open={newColor !== null}
          onOpenChange={(o) => !o && setNewColor(null)}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>New color</DialogTitle>
              <DialogDescription>
                Add images now, then pick this color in a variant
              </DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              placeholder="Color name"
              value={newColor ?? ""}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  createColor();
                }
              }}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewColor(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={createColor}
                disabled={!newColor?.trim()}
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
