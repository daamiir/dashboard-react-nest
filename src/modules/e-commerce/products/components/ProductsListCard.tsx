import { useMemo, useState } from "react";
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
import { cn } from "@/utils/cn";

import { products } from "../data/Products.data";
import type { Product, ProductSortField, SortDirection } from "../types";

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

function getAvatarColor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function formatPrice(price: number) {
  return `$${price.toLocaleString("en-US")}`;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}, ${date.getFullYear()}`;
}

const SORTABLE_COLUMNS: { field: ProductSortField; label: string }[] = [
  { field: "name", label: "Products" },
  { field: "category", label: "Category" },
  { field: "brand", label: "Brand" },
  { field: "price", label: "Price" },
];

export const ProductsListCard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<ProductSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query),
    );
  }, [search]);

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const result =
        typeof aValue === "number" && typeof bValue === "number"
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue));
      return sortDirection === "asc" ? result : -result;
    });
    return copy;
  }, [filtered, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = sorted.slice(pageStart, pageStart + PAGE_SIZE);

  const allOnPageSelected =
    pageProducts.length > 0 &&
    pageProducts.every((product) => selectedIds.has(product.id));

  function handleSort(field: ProductSortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllOnPage() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageProducts.forEach((product) => next.delete(product.id));
      } else {
        pageProducts.forEach((product) => next.add(product.id));
      }
      return next;
    });
  }

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="flex flex-col gap-4 p-0 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Products List</h1>
          <p className="text-sm text-muted-foreground">
            Track your store's progress to boost your sales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download />
            Export
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
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
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="pl-8"
            />
          </div>
          <Button variant="outline">
            <SlidersHorizontal />
            Filter
          </Button>
        </div>

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
                        sortField === field && "text-foreground",
                      )}
                    />
                  </button>
                </TableHead>
              ))}
              <TableHead>Stock</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                selected={selectedIds.has(product.id)}
                onToggle={() => toggleRow(product.id)}
              />
            ))}
            {pageProducts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  No products match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {sorted.length === 0 ? 0 : pageStart + 1} to{" "}
            {Math.min(pageStart + PAGE_SIZE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="icon"
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
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

function ProductRow({
  product,
  selected,
  onToggle,
}: {
  product: Product;
  selected: boolean;
  onToggle: () => void;
}) {
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
        <Badge
          variant={product.stock === "In Stock" ? "success" : "destructive"}
        >
          {product.stock}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(product.createdAt)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
