import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { ConfirmDialog } from "@/modules/products/components/ConfirmDialog";
import { formatPrice, variantUrl } from "@/modules/products/utils";
import { productImage } from "@/lib/image";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import { useWishlistStore } from "@/modules/wishlist/store/useWishlistStore";
import type { WishlistItem } from "@/modules/wishlist/store/useWishlistStore";

const WishlistPage = () => {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const clear = useWishlistStore((s) => s.clear);
  const addToCart = useCartStore((s) => s.addItem);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleBuy = (item: WishlistItem) => {
    addToCart({
      variantId: item.variantId,
      productId: item.productId,
      slug: item.slug,
      name: item.name + (item.label ? " " + item.label : ""),
      image: item.image,
      price: item.price,
      stockQuantity: item.stockQuantity,
    });
    toast.success("Added to cart");
  };

  return (
    <SurfaceCard className="p-0">
      <div className="flex items-center justify-between border-b px-6 py-5">
        <h1 className="text-2xl font-bold">Wishlist</h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 /> Clear all
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Your wishlist is empty.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/shop">Browse shop</Link>
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-4 p-4 sm:p-6">
          {items.map((item) => {
            const to = variantUrl(item.slug, item.sku);
            const inStock = item.stockQuantity > 0;
            return (
              <li
                key={item.variantId}
                className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row"
              >
                <Link
                  to={to}
                  className="size-28 shrink-0 self-start overflow-hidden rounded-xl bg-white p-1"
                >
                  {item.image && (
                    <img
                      src={productImage(item.image, { width: 240 })}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                  <div>
                    <Link
                      to={to}
                      className="line-clamp-2 font-semibold hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.label && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.label}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      SKU: {item.sku}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    className="rounded-full"
                    aria-label="Remove from wishlist"
                    onClick={() => remove(item.variantId)}
                  >
                    <Heart className="fill-current" />
                  </Button>
                </div>

                <div className="flex shrink-0 items-end justify-between gap-4 sm:flex-col">
                  <p className="text-2xl font-bold">
                    {formatPrice(item.price)}
                  </p>
                  <Button disabled={!inStock} onClick={() => handleBuy(item)}>
                    {inStock ? "Add to cart" : "Out of stock"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Clear wishlist"
        description="Remove all saved items from your wishlist?"
        onConfirm={clear}
      />
    </SurfaceCard>
  );
};

export default WishlistPage;
