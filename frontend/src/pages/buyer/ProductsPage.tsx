import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useProducts } from "@/modules/products/hooks/useProducts";
import type { Category } from "@/modules/products/types";
import { useDebounce } from "@/hooks/useDebounce";

const CATEGORIES: Category[] = ["SMARTPHONE", "LAPTOP", "TABLET", "HEADPHONES"];

// smartphone-only for now, so other categories fall back to price-only.
const RAM_OPTIONS = [4, 6, 8, 12, 16];
const STORAGE_OPTIONS = [64, 128, 256, 512, 1024];

const PAGE_SIZE = 8;

const ProductsPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | undefined>("SMARTPHONE");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ram, setRam] = useState<number | undefined>();
  const [storage, setStorage] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);

  const { data, isLoading, isError } = useProducts(
    {
      category,
      minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
      maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
      ram,
      storage,
      page,
      limit: PAGE_SIZE,
    },
    true,
  );

  const products = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const handleCategoryClick = (next: Category) => {
    setCategory((prev) => (prev === next ? undefined : next));
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 border-b">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => handleCategoryClick(c)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              category === c
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted"
            }`}
          >
            {c.charAt(0) + c.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Filters */}
        <aside className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Price</h3>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                className="h-9"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
              <span className="text-muted-foreground text-sm">–</span>
              <Input
                type="number"
                placeholder="Max"
                className="h-9"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {category === "SMARTPHONE" && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-2">RAM</h3>
                <div className="space-y-2">
                  {RAM_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <Checkbox
                        id={`ram-${option}`}
                        checked={ram === option}
                        onCheckedChange={(checked) => {
                          setRam(checked ? option : undefined);
                          setPage(1);
                        }}
                      />
                      <Label
                        htmlFor={`ram-${option}`}
                        className="text-sm font-normal"
                      >
                        {option} GB
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Storage</h3>
                <div className="space-y-2">
                  {STORAGE_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <Checkbox
                        id={`storage-${option}`}
                        checked={storage === option}
                        onCheckedChange={(checked) => {
                          setStorage(checked ? option : undefined);
                          setPage(1);
                        }}
                      />
                      <Label
                        htmlFor={`storage-${option}`}
                        className="text-sm font-normal"
                      >
                        {option} GB
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        <div className="grid grid-cols-1 gap-6">
          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 content-start">
            {isLoading &&
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
              ))}

            {isError && (
              <p className="col-span-full py-10 text-center text-sm text-destructive">
                Couldn't load products. Is the backend running?
              </p>
            )}

            {!isLoading && !isError && products.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                No products match your filters.
              </p>
            )}

            {!isLoading &&
              !isError &&
              products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => navigate(`/shop/${product.id}`)}
                  className="rounded-lg border overflow-hidden flex flex-col text-left hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toLocaleString("en-US")}
                    </p>
                  </div>
                </button>
              ))}
          </div>

          {/* Pagination */}
          {!isLoading && !isError && totalPages > 1 && (
            <Pagination className="mt-8 flex justify-center items-center">
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
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
    </div>
  );
};

export default ProductsPage;
