import { useState, useCallback } from "react";
import { UploadCloud, X } from "lucide-react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProductFormValues } from "@/modules/products/schema";

interface ImagePreview {
  file: File;
  url: string;
}

// One upload dropzone per variant. TODO: images aren't uploaded anywhere yet.
const VariantImageUploader = ({ index }: { index: number }) => {
  const { control } = useFormContext<ProductFormValues>();
  const [previews, setPreviews] = useState<ImagePreview[]>([]);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const next = Array.from(fileList).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...next]);
  }, []);

  const removeAt = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <Controller
      name={`variants.${index}.images`}
      control={control}
      render={() => (
        <div className="space-y-4">
          <label
            htmlFor={`variant-images-${index}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg py-12 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="rounded-full border p-3">
              <UploadCloud className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-center">
              <span className="font-medium text-foreground">
                Click to upload
              </span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
            <input
              id={`variant-images-${index}`}
              type="file"
              accept=".svg,.png,.jpg,.jpeg,.gif"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {previews.map((preview, i) => (
                <div
                  key={preview.url}
                  className="relative aspect-square rounded-md overflow-hidden border group"
                >
                  <img
                    src={preview.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAt(i)}
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

  return (
    <Card className="px-6 py-4 sm:px-6 rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2">
            {fields.length > 1 && (
              <p className="text-sm font-medium text-muted-foreground">
                Variant {index + 1}
              </p>
            )}
            <VariantImageUploader index={index} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
