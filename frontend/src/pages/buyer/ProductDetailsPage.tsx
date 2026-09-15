import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/modules/products/hooks/useProducts";
import { CATEGORY_SPECS } from "@/modules/products/config/category-specs.config";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center">
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

  const specFields = CATEGORY_SPECS[product.category] ?? [];
  const attributes = product.attributes ?? {};

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            {product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((src, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md overflow-hidden bg-muted"
                >
                  <img
                    src={src}
                    alt={`${product.name} ${i + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-semibold">
                ${product.price.toLocaleString("en-US")}
              </span>
              <Badge
                variant={product.stockQuantity > 0 ? "success" : "destructive"}
              >
                {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full sm:w-auto"
            disabled={product.stockQuantity === 0}
          >
            Add to Cart
          </Button>

          <div>
            <h2 className="text-sm font-semibold mb-2">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {specFields.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-3">Specifications</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {specFields
                  .filter((field) => attributes[field.key] !== undefined)
                  .map((field) => {
                    const value = attributes[field.key];
                    const display =
                      field.type === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : `${value}${field.unit ? ` ${field.unit}` : ""}`;
                    return (
                      <div
                        key={field.key}
                        className="flex justify-between border-b py-1.5"
                      >
                        <dt className="text-muted-foreground">{field.label}</dt>
                        <dd className="font-medium">{display}</dd>
                      </div>
                    );
                  })}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
