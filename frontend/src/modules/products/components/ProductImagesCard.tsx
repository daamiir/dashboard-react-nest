import { useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import {
  useFormContext,
  useFieldArray,
  useWatch,
  Controller,
} from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProductFormValues } from "@/modules/products/schema";
import { uploadImage } from "@/modules/products/api/uploads.api";

// One upload dropzone per variant, stores Cloudinary URLs in the form
const VariantImageUploader = ({ index }: { index: number }) => {
  const { control } = useFormContext<ProductFormValues>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      name={`variants.${index}.images`}
      control={control}
      render={({ field }) => (
        <div className="space-y-4">
          <label
            htmlFor={`variant-images-${index}`}
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
              id={`variant-images-${index}`}
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
                  className="relative aspect-square rounded-md overflow-hidden border group"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
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
  const { control } = useFormContext<ProductFormValues>();
  const { fields } = useFieldArray({ control, name: "variants" });
  const variants = useWatch({ control, name: "variants" }); // live sku and color values

  return (
    <Card className="px-6 py-4 sm:px-6 rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {fields.map((field, index) => {
          const sku = variants?.[index]?.sku;
          const color = String(variants?.[index]?.attributes?.color ?? "");
          const ram = String(variants?.[index]?.attributes?.ram ?? "");
          const storage = String(variants?.[index]?.attributes?.storage ?? "");

          return (
            <div key={field.id} className="space-y-2">
              {(fields.length > 1 || sku || color) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {sku || `Variant ${index + 1}`}
                  </span>
                  {color && (
                    <span className="text-xs text-muted-foreground">
                      {color}
                    </span>
                  )}
                  {(ram || storage) && (
                    <span className="text-xs text-muted-foreground">
                      {ram && storage ? `${ram}/${storage}` : ram || storage}
                    </span>
                  )}
                </div>
              )}
              <VariantImageUploader index={index} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
