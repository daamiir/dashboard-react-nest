import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
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

export const ProductRow = ({
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
    <TableRow data-state={selected ? "selected" : undefined}>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          aria-label={`Select ${product.name}`}
        />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white",
              getAvatarColor(product.brand),
            )}
          >
            {product.name.charAt(0)}
          </div>
          {product.name}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{product.brand}</TableCell>
      <TableCell>{formatPriceRange(product)}</TableCell>
      <TableCell className="text-muted-foreground">{categoryName}</TableCell>
      <TableCell>
        <Badge variant={inStock ? "success" : "destructive"}>
          {inStock ? "In Stock" : "Out of Stock"}
        </Badge>
      </TableCell>
      <TableCell className="hidden text-muted-foreground lg:table-cell">
        {formatDate(product.createdAt)}
      </TableCell>
      <TableCell>
        {userId === product.createdById && (
          <ProductActionsMenu product={product} />
        )}
      </TableCell>
    </TableRow>
  );
};
