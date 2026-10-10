import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { formatVariantLabel } from "@/modules/products/utils";
import type { Product, ProductVariant } from "@/modules/products/types";
import { useWishlistStore } from "../store/useWishlistStore";

interface Props {
  product: Product;
  variant: ProductVariant;
  className?: string;
}

export const WishlistButton = ({ product, variant, className }: Props) => {
  const saved = useWishlistStore((s) =>
    s.items.some((i) => i.variantId === variant.id),
  );
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      className={cn(
        "rounded-full",
        saved && "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      onClick={() => {
        toggle({
          variantId: variant.id,
          productId: product.id,
          slug: product.slug,
          sku: variant.sku,
          name: product.name,
          label: formatVariantLabel(variant),
          image: variant.images[0] ?? null,
          price: variant.price,
          stockQuantity: variant.stockQuantity,
        });
        toast.success(saved ? "Removed from wishlist" : "Added to wishlist");
      }}
    >
      <Heart className={cn(saved && "fill-current")} />
    </Button>
  );
};
