import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const categories = ["Smartphones", "Tablets", "Laptops", "Smartwatches"];

const ProductsPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 border-b">
        {categories.map((category) => (
          <button
            key={category}
            className="shrink-0 rounded-full border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Filters */}
        <aside className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox id={category} />
                  <Label htmlFor={category} className="text-sm font-normal">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Price</h3>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Min" className="h-9" />
              <span className="text-muted-foreground text-sm">–</span>
              <Input type="number" placeholder="Max" className="h-9" />
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Apply filters
          </Button>
        </aside>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 content-start">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border overflow-hidden flex flex-col"
            >
              <div className="aspect-square bg-muted" />
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium line-clamp-1">Product name</p>
                <p className="text-sm text-muted-foreground">$0.00</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductsPage;
