import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCategoryName } from "../hooks/useCategoryName";
import type { Product } from "../types";
import {
  formatDate,
  formatPriceRange,
  getAvatarColor,
  totalStock,
} from "../utils";
import { ProductActionsMenu } from "./ProductActionsMenu";

export const ProductMobileCard = ({
  product,
  selected,
  onToggle,
}: {
  product: Product;
  selected: boolean;
  onToggle: () => void;
}) => {
  const userId = useAuthStore((state) => state.user?.id);
  const categoryName = useCategoryName(product.categoryId);
  const inStock = totalStock(product) > 0;

  return (
    <div
      data-state={selected ? "selected" : undefined}
      className="flex items-start gap-3 rounded-xl p-3 data-[state=selected]:bg-muted dark:border-gray-800"
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onToggle}
        aria-label={`Select ${product.name}`}
        className="mt-1"
      />
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white",
          getAvatarColor(product.brand),
        )}
      >
        {product.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {categoryName} · {product.brand}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">
            {formatPriceRange(product)}
          </span>
          <Badge variant={inStock ? "success" : "destructive"}>
            {inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(product.createdAt)}
        </p>
      </div>
      {userId === product.createdById && (
        <ProductActionsMenu product={product} />
      )}
    </div>
  );
};
