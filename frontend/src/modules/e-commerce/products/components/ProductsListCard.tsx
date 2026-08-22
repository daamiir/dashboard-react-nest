import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";

import { useDeleteProduct, useProducts } from "../hooks/useProducts";
import type { Product, SortBy, SortOrder } from "../types";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 7;

const AVATAR_PALETTE = [
  "bg-slate-900",
  "bg-blue-600",
  "bg-purple-600",
  "bg-orange-500",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-amber-600",
];

const getAvatarColor = (key: string) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US")}`;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}, ${date.getFullYear()}`;
};

const SORTABLE_COLUMNS: { field: SortBy; label: string }[] = [
  { field: "name", label: "Products" },
  { field: "category", label: "Category" },
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
  const {
    data: response,
    isLoading,
    isError,
  } = useProducts({
    search: debouncedSearch,
    sortBy,
    sortOrder,
    page,
    limit,
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const pageProducts = response?.data ?? [];
  const totalPages = response?.meta.totalPages ?? 1;
  const totalProducts = response?.meta.total ?? 0;

  const allOnPageSelected =
    totalProducts > 0 &&
    pageProducts.every((product) => selectedIds.has(product.id));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
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
      if (allOnPageSelected) {
        pageProducts.forEach((product) => next.delete(product.id));
      } else {
        pageProducts.forEach((product) => next.add(product.id));
      }
      return next;
    });
  };

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="flex flex-col gap-4 p-0 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Products List</h1>
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
            onClick={() => navigate("/e-commerce/add-product")}
          >
            <Plus />
            Add Product
          </Button>
        </div>
      </CardHeader>

      <CardContent className="mt-4 flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={handleChange}
              placeholder="Search..."
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setLimit(5)}
              >
                5
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setLimit(10)}
              >
                10
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setLimit(20)}
              >
                20
              </Button>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <SlidersHorizontal />
              Filter
            </Button>
          </div>
        </div>

        {/* Mobile version*/}
        <div className="flex flex-col gap-2 md:hidden">
          {pageProducts.map((product) => (
            <ProductMobileCard
              key={product.id}
              product={product}
              selected={selectedIds.has(product.id)}
              onToggle={() => toggleRow(product.id)}
            />
          ))}
          {totalProducts === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No products match your search.
            </p>
          )}
        </div>

        {/* Tablet & up versions */}
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
                <TableHead>Stock</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Created At
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

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
                    colSpan={7}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                ),
              )}
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

const ProductActionsMenu = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${product.name}`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => navigate(`/e-commerce/edit-product/${product.id}`)}
          >
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{product.name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can't be undone. This will permanently remove the
            product from your inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteProduct.mutate(product.id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ProductRow = ({
  product,
  selected,
  onToggle,
}: {
  product: Product;
  selected: boolean;
  onToggle: () => void;
}) => {
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
      <TableCell className="text-muted-foreground">
        {product.category}
      </TableCell>
      <TableCell className="text-muted-foreground">{product.brand}</TableCell>
      <TableCell>{formatPrice(product.price)}</TableCell>
      <TableCell>
        <Badge variant={product.stockQuantity > 0 ? "success" : "destructive"}>
          {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
        </Badge>
      </TableCell>
      <TableCell className="hidden text-muted-foreground lg:table-cell">
        {formatDate(product.createdAt)}
      </TableCell>
      <TableCell>
        <ProductActionsMenu product={product} />
      </TableCell>
    </TableRow>
  );
};

const ProductMobileCard = ({
  product,
  selected,
  onToggle,
}: {
  product: Product;
  selected: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      data-state={selected ? "selected" : undefined}
      className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 data-[state=selected]:bg-muted dark:border-gray-800"
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
          {product.category} · {product.brand}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">
            {formatPrice(product.price)}
          </span>
          <Badge
            variant={product.stockQuantity > 0 ? "success" : "destructive"}
          >
            {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(product.createdAt)}
        </p>
      </div>
      <ProductActionsMenu product={product} />
    </div>
  );
};
