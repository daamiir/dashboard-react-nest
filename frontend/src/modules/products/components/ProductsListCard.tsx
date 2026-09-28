import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";
import { useDebounce } from "@/hooks/useDebounce";

import { useMyProducts, useProducts } from "../hooks/useProducts";
import type { SortBy, SortOrder } from "../types";
import { ProductRow } from "./ProductRow";
import { ProductMobileCard } from "./ProductMobileCard";

const PAGE_SIZE = 7;
const LIMIT_OPTIONS = [5, 10, 20];

const SORTABLE_COLUMNS: { field: SortBy; label: string }[] = [
  { field: "name", label: "Products" },
  { field: "brand", label: "Brand" },
  { field: "price", label: "Price" },
];

export const ProductsListCard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState<"all" | "my-products">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const query = { search: debouncedSearch, sortBy, sortOrder, page, limit };
  const allProducts = useProducts(query, viewMode === "all");
  const myProducts = useMyProducts(query, viewMode === "my-products");

  // Active query result for the current view
  const {
    data: response,
    isLoading,
    isError,
  } = viewMode === "all" ? allProducts : myProducts;

  const pageProducts = response?.data ?? [];
  const totalPages = response?.meta.totalPages ?? 1;
  const totalProducts = response?.meta.total ?? 0;

  const allOnPageSelected =
    pageProducts.length > 0 && pageProducts.every((p) => selectedIds.has(p.id));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Toggle order on same column, reset to asc on a new one
  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleLimit = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      pageProducts.forEach((p) =>
        allOnPageSelected ? next.delete(p.id) : next.add(p.id),
      );
      return next;
    });
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "all" ? "my-products" : "all"));
    setPage(1);
  };

  return (
    <Card className="rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="flex flex-col gap-4 p-0 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">
            {viewMode === "all" ? "All" : "My"} Products List
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your store's progress to boost your sales.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Download />
            Export
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 sm:flex-none"
            onClick={() => navigate("/admin/products/add")}
          >
            <Plus />
            Add Product
          </Button>
        </div>
      </CardHeader>

      <CardContent className="mt-4 flex flex-col gap-4 p-0">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={handleSearch}
              placeholder="Search..."
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {LIMIT_OPTIONS.map((n) => (
                <Button
                  key={n}
                  variant={limit === n ? "default" : "outline"}
                  className="w-full sm:w-auto"
                  onClick={() => handleLimit(n)}
                >
                  {n}
                </Button>
              ))}
              <Button
                variant={viewMode === "all" ? "outline" : "default"}
                onClick={toggleViewMode}
              >
                My Products
              </Button>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <SlidersHorizontal />
              Filter
            </Button>
          </div>
        </div>

        {/* Mobile list */}
        <div className="flex flex-col gap-2 md:hidden">
          {pageProducts.map((product) => (
            <ProductMobileCard
              key={product.id}
              product={product}
              selected={selectedIds.has(product.id)}
              onToggle={() => toggleRow(product.id)}
            />
          ))}
          {!isLoading && !isError && totalProducts === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No products match your search.
            </p>
          )}
        </div>

        {/* Table (tablet and up) */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleAllOnPage}
                    aria-label="Select all products on this page"
                  />
                </TableHead>
                {SORTABLE_COLUMNS.map(({ field, label }) => (
                  <TableHead key={field}>
                    <button
                      type="button"
                      onClick={() => handleSort(field)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      {label}
                      <ArrowUpDown
                        className={cn(
                          "size-3.5",
                          sortBy === field && "text-foreground",
                        )}
                      />
                    </button>
                  </TableHead>
                ))}
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Created At
                </TableHead>
                <TableHead className="w-11" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-destructive"
                  >
                    Couldn't load products. Is the backend running?
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && totalProducts === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No products match your search.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                pageProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    selected={selectedIds.has(product.id)}
                    onToggle={() => toggleRow(product.id)}
                  />
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer: range and pagination */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {totalProducts === 0 ? 0 : (page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalProducts)} of {totalProducts}
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft />
            </Button>

            <div className="hidden items-center gap-1.5 sm:flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant={n === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
            </div>
            <span className="px-2 text-sm font-medium sm:hidden">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
