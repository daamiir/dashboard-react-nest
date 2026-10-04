import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { formatPrice } from "@/modules/products/utils";
import { productImage } from "@/lib/image";
import {
  selectCartCount,
  selectCartTotal,
  useCartStore,
} from "@/modules/cart/store/useCartStore";

const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const total = useCartStore(selectCartTotal);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        <Button className="mt-4" asChild>
          <Link to="/shop">Browse shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <SurfaceCard>
        <h1 className="text-xl font-bold">Cart ({count})</h1>
        <ul className="mt-4 divide-y">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-4 py-4">
              <Link
                to={"/shop/" + item.slug}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white p-1"
              >
                {item.image && (
                  <img
                    src={productImage(item.image, { width: 160 })}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                )}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Link
                  to={"/shop/" + item.slug}
                  className="truncate text-sm font-medium"
                >
                  {item.name}
                </Link>
                <span className="text-sm font-semibold">
                  {formatPrice(item.price)}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      setQuantity(item.variantId, item.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus />
                  </Button>
                  <span className="w-6 text-center text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={item.quantity >= item.stockQuantity}
                    onClick={() =>
                      setQuantity(item.variantId, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="ml-auto"
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Remove item"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SurfaceCard>

      <aside className="lg:sticky lg:top-20">
        <SurfaceCard>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </div>
          <Button size="lg" className="mt-5 w-full" asChild>
            <Link to="/checkout">Checkout</Link>
          </Button>
        </SurfaceCard>
      </aside>
    </div>
  );
};

export default CartPage;
