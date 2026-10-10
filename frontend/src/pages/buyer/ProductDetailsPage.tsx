import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { SpecRow } from "@/components/shared/SpecRow";
import { useProductBySlug } from "@/modules/products/hooks/useProducts";
import { useVariantSelection } from "@/modules/products/hooks/useVariantSelection";
import { useCategories } from "@/modules/categories/hooks/useCategories";
import { CATEGORY_SPECS } from "@/modules/products/config/category-specs.config";
import { formatPrice } from "@/modules/products/utils";
import { productImage } from "@/lib/image";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import { WishlistButton } from "@/modules/wishlist/components/WishlistButton";

const MAX_THUMBS = 5;

const ProductDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { data: categories = [] } = useCategories();
  const linked = product?.variants.find(
    (v) => v.sku === searchParams.get("variant"),
  );
  const { colors, colorImages, storages, activeVariant, optionStatus, select } =
    useVariantSelection(product, {
      color: linked ? String(linked.attributes.color ?? "") || null : null,
      storage: linked ? String(linked.attributes.storage ?? "") || null : null,
    });
  const [imageIndex, setImageIndex] = useState(0);
  const [descOpen, setDescOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore(
    (s) =>
      s.items.find((i) => i.variantId === activeVariant?.id)?.quantity ?? 0,
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-[520px] rounded-2xl" />
        <Skeleton className="h-[260px] rounded-2xl" />
      </div>
    );
  }

  if (isError || !product || !activeVariant) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Couldn't load this product. It may no longer be available.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/shop")}
        >
          Back to shop
        </Button>
      </div>
    );
  }

  const { ram, storage, color } = activeVariant.attributes as {
    ram?: number;
    storage?: number;
    color?: string;
  };
  const { screenSize, mainCamera } = product.attributes as {
    screenSize?: number;
    mainCamera?: number;
  };

  const category = categories.find((c) => c.id === product.categoryId);
  const specFields = category ? (CATEGORY_SPECS[category.slug] ?? []) : [];

  // Spec rows with unit or Yes/No
  const specs = specFields
    .filter((f) => product.attributes[f.key] !== undefined)
    .map((f) => {
      const v = product.attributes[f.key];
      const value =
        f.type === "boolean"
          ? v
            ? "Yes"
            : "No"
          : `${v}${f.unit ? ` ${f.unit}` : ""}`;
      return { label: f.label, value };
    });

  const images = activeVariant.images.length
    ? activeVariant.images
    : ["/placeholder.jpg"];

  const thumbStart = Math.min(
    Math.max(imageIndex - Math.floor(MAX_THUMBS / 2), 0),
    Math.max(images.length - MAX_THUMBS, 0),
  );
  const visibleThumbs = images.slice(thumbStart, thumbStart + MAX_THUMBS);
  const inStock = activeVariant.stockQuantity > 0;
  const atMax = inStock && inCart >= activeVariant.stockQuantity;

  // Title suffix, e.g. 12/256GB/6.3/48 Silver
  const suffix =
    ram && storage
      ? ` ${ram}/${storage}GB/${screenSize ?? ""}/${mainCamera ?? ""} ${color ?? ""}`
      : "";

  const handleAddToCart = () => {
    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name + suffix,
      image: activeVariant.images[0] ?? null,
      price: activeVariant.price,
      stockQuantity: activeVariant.stockQuantity,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex min-w-0 flex-col gap-4">
        {/* Card 1: basic */}
        <SurfaceCard>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold">
              {product.name}
              {suffix}
            </h1>
            <WishlistButton
              product={product}
              variant={activeVariant}
              className="shrink-0"
            />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)]">
            {images.length > 1 && (
              <div className="order-2 flex items-center gap-2 md:order-1 md:flex-col">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={imageIndex === 0}
                  onClick={() => setImageIndex((i) => i - 1)}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="md:rotate-90" />
                </Button>
                {visibleThumbs.map((src, n) => {
                  const i = thumbStart + n;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageIndex(i)}
                      className={cn(
                        "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition",
                        imageIndex === i ? "border-primary" : "border-gray-200",
                      )}
                    >
                      <img
                        src={src}
                        alt={`${product.name} ${i + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </button>
                  );
                })}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={imageIndex >= images.length - 1}
                  onClick={() => setImageIndex((i) => i + 1)}
                  aria-label="Next image"
                >
                  <ChevronRight className="md:rotate-90" />
                </Button>
              </div>
            )}

            <div className="order-1 flex items-center justify-center md:order-2">
              <img
                src={productImage(images[imageIndex] ?? images[0])}
                alt={product.name}
                className="max-h-[400px] w-full object-contain mix-blend-multiply"
              />
            </div>

            <div className="order-3 flex flex-col gap-5">
              {colors.length > 0 && (
                <ColorPicker
                  current={color}
                  options={colors}
                  images={colorImages}
                  status={(c) => optionStatus("color", c)}
                  onSelect={(c) => {
                    select("color", c);
                    setImageIndex(0);
                  }}
                />
              )}
              {storages.length > 0 && (
                <OptionGroup
                  label="Storage, GB"
                  options={storages}
                  isActive={(s) => String(storage) === s}
                  status={(s) => optionStatus("storage", s)}
                  onSelect={(s) => select("storage", s)}
                />
              )}
              {specs.length > 0 && (
                <div>
                  <div className="mb-1 text-sm font-semibold">
                    Characteristics
                  </div>
                  {specs.slice(0, 4).map((s) => (
                    <SpecRow key={s.label} {...s} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </SurfaceCard>

        {/* Card 2: description */}
        <SurfaceCard>
          <h2 className="mb-4 text-xl font-bold">Description</h2>
          <div
            className={cn("relative overflow-hidden", !descOpen && "max-h-40")}
          >
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            {!descOpen && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          {product.description.length > 320 && (
            <ToggleLink
              open={descOpen}
              onToggle={() => setDescOpen((v) => !v)}
              openLabel="Read more"
            />
          )}
        </SurfaceCard>

        {/* Card 3: characteristics */}
        {specs.length > 0 && (
          <SurfaceCard>
            <h2 className="mb-4 text-xl font-bold">Characteristics</h2>
            {(specsOpen ? specs : specs.slice(0, 8)).map((s) => (
              <SpecRow key={s.label} {...s} />
            ))}
            {specs.length > 8 && (
              <ToggleLink
                open={specsOpen}
                onToggle={() => setSpecsOpen((v) => !v)}
                openLabel="Show all"
              />
            )}
          </SurfaceCard>
        )}
      </div>

      {/* Sticky purchase card */}
      <aside className="lg:sticky lg:top-20">
        <SurfaceCard>
          <p className="text-xs text-muted-foreground">
            SKU: {activeVariant.sku}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl font-extrabold">
              {formatPrice(activeVariant.price)}
            </span>
            <Badge variant={inStock ? "default" : "destructive"}>
              {inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
          <Button
            size="lg"
            className="mt-5 w-full"
            disabled={!inStock || atMax}
            onClick={handleAddToCart}
          >
            {!inStock ? "Out of Stock" : atMax ? "Max in cart" : "Add to Cart"}
          </Button>
        </SurfaceCard>
      </aside>
    </div>
  );
};

// Pill group for a variant option
const OptionGroup = ({
  label,
  current,
  options,
  format = (o) => o,
  isActive,
  status,
  onSelect,
}: {
  label: string;
  current?: string;
  options: string[];
  format?: (o: string) => string;
  isActive: (o: string) => boolean;
  status?: (o: string) => string;
  onSelect: (o: string) => void;
}) => (
  <div className="space-y-2">
    <div className="text-sm font-semibold">
      {label}
      {current && (
        <span className="font-normal text-muted-foreground">: {current}</span>
      )}
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Button
          key={o}
          type="button"
          size="sm"
          className={cn(
            "rounded-full disabled:line-through",
            status?.(o) === "switch" && "opacity-60",
          )}
          variant={isActive(o) ? "default" : "outline"}
          disabled={status?.(o) === "out"}
          onClick={() => onSelect(o)}
        >
          {format(o)}
        </Button>
      ))}
    </div>
  </div>
);

const ColorPicker = ({
  current,
  options,
  images,
  status,
  onSelect,
}: {
  current?: string;
  options: string[];
  images: Record<string, string | undefined>;
  status?: (o: string) => string;
  onSelect: (o: string) => void;
}) => (
  <div className="space-y-2">
    <div className="text-sm font-semibold">
      Color
      {current && (
        <span className="font-normal text-muted-foreground">: {current}</span>
      )}
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          title={o}
          aria-label={o}
          aria-pressed={current === o}
          disabled={status?.(o) === "out"}
          onClick={() => onSelect(o)}
          className={cn(
            "flex h-12 w-12 ... leading-tight transition disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale",
            current === o
              ? "border-primary"
              : "border-gray-200 hover:border-gray-400",
            status?.(o) === "switch" && "opacity-50",
          )}
        >
          {images[o] ? (
            <img
              src={productImage(images[o]!, { width: 272 })}
              alt={o}
              className="h-3/4 w-3/4 object-contain mix-blend-multiply"
            />
          ) : (
            o
          )}
        </button>
      ))}
    </div>
  </div>
);

// Expand/collapse link
const ToggleLink = ({
  open,
  onToggle,
  openLabel,
}: {
  open: boolean;
  onToggle: () => void;
  openLabel: string;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="mx-auto mt-3 block text-sm font-medium text-blue-500 hover:text-blue-600"
  >
    {open ? "Show less" : openLabel}
  </button>
);

export default ProductDetailsPage;
