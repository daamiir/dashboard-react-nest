import { UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProductImagesCard = () => {
  return (
    <Card className="px-6 py-4">
      <CardHeader className="border-b">
        <CardTitle>
          Products Images
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <label
          htmlFor="product-images"
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg py-12 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="rounded-full border p-3">
            <UploadCloud className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-center">
            <span className="font-medium text-foreground">Click to upload</span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </p>
          <p className="text-xs text-muted-foreground">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
          <input
            id="product-images"
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.gif"
            multiple
            className="hidden"
          />
        </label>
      </CardContent>
    </Card>
  );
};
