import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { useProducts } from "@/modules/products/hooks/useProducts";
import { useCategories } from "@/modules/categories/hooks/useCategories";
import { formatPrice, formatVariantLabel } from "@/modules/products/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";
import type { Product, ProductVariant } from "@/modules/products/types";
import { productImage } from "@/lib/image";

const RAM_OPTIONS = [4, 6, 8, 12, 16];
const STORAGE_OPTIONS = [64, 128, 256, 512, 1024];
const PAGE_SIZE = 8;

// Single-select checkbox group for numeric filters
const FilterGroup = ({
  title,
  prefix,
  options,
  value,
  onChange,
}: {
  title: string;
  prefix: string;
  options: number[];
  value?: number;
  onChange: (v?: number) => void;
}) => (
  <div>
    <h3 className="mb-2 text-sm font-semibold">{title}</h3>
    <div className="space-y-2">
      {options.map((o) => (
        <div key={o} className="flex items-center gap-2">
          <Checkbox
            id={`${prefix}-${o}`}
            checked={value === o}
            onCheckedChange={(checked) => onChange(checked ? o : undefined)}
          />
          <Label htmlFor={`${prefix}-${o}`} className="text-sm font-normal">
            {o} GB
          </Label>
        </div>
      ))}
    </div>
  </div>
);

// One tile per variant in the listing grid
const ProductCard = ({
  product,
  variant,
  onOpen,
}: {
  product: Product;
  variant: ProductVariant;
  onOpen: () => void;
}) => {
  const inStock = variant.stockQuantity > 0;
  const images = variant.images.slice(0, 5);
  const [index, setIndex] = useState(0);
  const label = formatVariantLabel(variant);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setIndex(
      Math.min(
        images.length - 1,
        Math.max(0, Math.floor(ratio * images.length)),
      ),
    );
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col rounded-2xl bg-white p-3 text-left transition-shadow hover:shadow-md"
    >
      <div
        onMouseMove={handleMove}
        onMouseLeave={() => setIndex(0)}
        className="relative aspect-square cursor-grab overflow-hidden rounded-xl active:cursor-grabbing"
      >
        {images[index] && (
          <img
            src={productImage(images[index], { width: 600 })}
            alt={product.name}
            className="h-full w-full object-contain p-2 mix-blend-multiply"
          />
        )}
        {!inStock && (
          <Badge variant="destructive" className="absolute right-2 top-2">
            Out of Stock
          </Badge>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i === index ? "bg-orange-500" : "bg-gray-300",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-between gap-2">
        <div>
          <p className="mt-0.5 line-clamp-2 text-sm font-medium">
            {product.name}
          </p>
          {label && (
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          )}
        </div>
        <p className="text-base font-bold">{formatPrice(variant.price)}</p>
      </div>
    </button>
  );
};

const ProductsPage = () => {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();

  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ram, setRam] = useState<number | undefined>();
  const [storage, setStorage] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const debouncedMin = useDebounce(minPrice, 400);
  const debouncedMax = useDebounce(maxPrice, 400);

  const { data, isLoading, isError } = useProducts({
    categoryId,
    minPrice: debouncedMin ? Number(debouncedMin) : undefined,
    maxPrice: debouncedMax ? Number(debouncedMax) : undefined,
    ram,
    storage,
    page,
    limit: PAGE_SIZE,
  });

  const products = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 1;

  // One tile per variant
  const tiles = products.flatMap((p) =>
    p.variants.map((v) => ({ product: p, variant: v })),
  );

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const isSmartphone = selectedCategory?.slug === "smartphone";

  // Update a filter and reset to first page
  const withReset =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      setter(v);
      setPage(1);
    };

  // Toggle category and clear category-specific filters
  const handleCategoryClick = (id: string) => {
    setCategoryId((prev) => (prev === id ? undefined : id));
    setRam(undefined);
    setStorage(undefined);
    setPage(1);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
      {/* ---------- Filters (sticky) ---------- */}
      <aside className="md:sticky md:top-20">
        <SurfaceCard className="space-y-6 bg-sidebar p-5">
          {/* Categories */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategoryClick(c.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    categoryId === c.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-gray-200 hover:bg-muted",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Price</h3>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                className="h-9"
                value={minPrice}
                onChange={(e) => withReset(setMinPrice)(e.target.value)}
              />
              <span className="text-sm text-muted-foreground">–</span>
              <Input
                type="number"
                placeholder="Max"
                className="h-9"
                value={maxPrice}
                onChange={(e) => withReset(setMaxPrice)(e.target.value)}
              />
            </div>
          </div>

          {/* Smartphone-only filters */}
          {isSmartphone && (
            <>
              <FilterGroup
                title="RAM"
                prefix="ram"
                options={RAM_OPTIONS}
                value={ram}
                onChange={withReset(setRam)}
              />
              <FilterGroup
                title="Storage"
                prefix="storage"
                options={STORAGE_OPTIONS}
                value={storage}
                onChange={withReset(setStorage)}
              />
            </>
          )}
        </SurfaceCard>
      </aside>

      {/* ---------- Listing ---------- */}
      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {selectedCategory?.name ?? "All products"}
          </h1>
          {!isLoading && !isError && (
            <p className="mt-1 text-sm text-muted-foreground">
              Found {total} products
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 content-start gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {isLoading &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="aspect-3/4 rounded-2xl" />
            ))}

          {isError && (
            <p className="col-span-full py-10 text-center text-sm text-destructive">
              Couldn't load products. Is the backend running?
            </p>
          )}

          {!isLoading && !isError && tiles.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No products match your filters.
            </p>
          )}

          {!isLoading &&
            !isError &&
            tiles.map(({ product, variant }) => (
              <ProductCard
                key={variant.id}
                product={product}
                variant={variant}
                onOpen={() =>
                  navigate(
                    `/shop/${product.slug}?variant=${encodeURIComponent(variant.sku)}`,
                  )
                }
              />
            ))}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    isActive={n === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(n);
                    }}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
