import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useProductBySlug } from "@/modules/products/hooks/useProducts";
import { useCategories } from "@/modules/categories/hooks/useCategories";
import { CATEGORY_SPECS } from "@/modules/products/config/category-specs.config";

const ProductDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { data: categories = [] } = useCategories();

  // Active selections for dynamic variant picker
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Extract unique colors and storage options from product variants
  const colors = useMemo(() => {
    if (!product?.variants) return [];
    return Array.from(
      new Set(
        product.variants
          .map((v) => v.attributes.color as string)
          .filter(Boolean),
      ),
    );
  }, [product]);

  const storages = useMemo(() => {
    if (!product?.variants) return [];
    return Array.from(
      new Set(
        product.variants
          .map((v) =>
            v.attributes.storage ? String(v.attributes.storage) : null,
          )
          .filter(Boolean),
      ),
    );
  }, [product]);

  // Dynamically resolve active variant based on pickers or default to first
  const activeVariant = useMemo(() => {
    if (!product?.variants?.length) return null;

    const matched = product.variants.find((v) => {
      const matchColor = !selectedColor || v.attributes.color === selectedColor;
      const matchStorage =
        !selectedStorage || String(v.attributes.storage) === selectedStorage;
      return matchColor && matchStorage;
    });

    return matched ?? product.variants[0];
  }, [product, selectedColor, selectedStorage]);

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

  if (isError || !product || !activeVariant) {
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

  const category = categories.find((c) => c.id === product.categoryId);
  const specFields = category ? (CATEGORY_SPECS[category.slug] ?? []) : [];
  const attributes = product.attributes ?? {};
  const images =
    activeVariant.images.length > 0
      ? activeVariant.images
      : ["/placeholder.jpg"];
  const currentImage = images[activeImageIndex] ?? images[0];

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
            <img
              src={currentImage}
              alt={product.name}
              className="h-full w-full object-contain p-2"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square rounded-md overflow-hidden bg-muted border-2 transition-all ${
                    activeImageIndex === i
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {product.brand}
            </p>
            <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-3xl font-extrabold">
                ${activeVariant.price.toLocaleString("en-US")}
              </span>
              <Badge
                variant={
                  activeVariant.stockQuantity > 0 ? "default" : "destructive"
                }
              >
                {activeVariant.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isSelected =
                    selectedColor === color ||
                    (!selectedColor &&
                      activeVariant.attributes.color === color);
                  return (
                    <Button
                      key={color}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Storage Selector */}
          {storages.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Storage
              </label>
              <div className="flex flex-wrap gap-2">
                {storages.map((storage) => {
                  const isSelected =
                    selectedStorage === storage ||
                    (!selectedStorage &&
                      String(activeVariant.attributes.storage) === storage);
                  return (
                    <Button
                      key={storage}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStorage(storage)}
                    >
                      {storage} GB
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full sm:w-auto px-8"
            disabled={activeVariant.stockQuantity === 0}
          >
            {activeVariant.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
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
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm border-t pt-2">
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
