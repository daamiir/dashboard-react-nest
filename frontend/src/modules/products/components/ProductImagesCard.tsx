import { useEffect, useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProductFormValues } from "@/modules/products/schema";
import { uploadImage } from "@/modules/products/api/uploads.api";

type ImagesFieldName =
  | `variants.${number}.images`
  | `colorImages.${number}.images`;

// Upload dropzone bound to any images field, stores Cloudinary URLs
const ImageUploader = ({ name }: { name: ImagesFieldName }) => {
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

// Per-variant opt-in to its own images instead of the color set
const VariantOverride = ({
  index,
  label,
}: {
  index: number;
  label: string;
}) => {
  const { control, setValue } = useFormContext<ProductFormValues>();
  const own = useWatch({ control, name: `variants.${index}.images` });
  const [custom, setCustom] = useState(own.length > 0);

  return (
    <div className="space-y-2">
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
        {label}: custom images
      </label>
      {custom && <ImageUploader name={`variants.${index}.images`} />}
    </div>
  );
};

export const ProductImagesCard = () => {
  const { control, setValue } = useFormContext<ProductFormValues>();
  const variants = useWatch({ control, name: "variants" });
  const colorImages = useWatch({ control, name: "colorImages" });

  const colors = [
    ...new Set(
      variants.map((v) => String(v.attributes?.color ?? "")).filter(Boolean),
    ),
  ];

  // Ensure every color used by a variant has an entry in the form
  useEffect(() => {
    const missing = colors.filter(
      (c) => !colorImages.some((ci) => ci.color === c),
    );
    if (missing.length) {
      setValue("colorImages", [
        ...colorImages,
        ...missing.map((color) => ({ color, images: [] })),
      ]);
    }
  }, [colors.join("|"), colorImages, setValue]);

  return (
    <Card className="px-6 py-4 sm:px-6 rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {colors.map((color) => {
          const idx = colorImages.findIndex((ci) => ci.color === color);
          if (idx === -1) return null;
          return (
            <div key={color} className="space-y-2">
              <div className="text-sm font-medium">{color}</div>
              <ImageUploader name={`colorImages.${idx}.images`} />
            </div>
          );
        })}

        {variants.length > 1 && (
          <div className="space-y-3 border-t pt-4">
            {variants.map((v, index) => {
              const a = v.attributes;
              const label =
                v.sku ||
                [a?.color, a?.ram, a?.storage].filter(Boolean).join(" / ") ||
                `Variant ${index + 1}`;
              return (
                <VariantOverride key={index} index={index} label={label} />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
