import { useState, useMemo, type ReactNode, act } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useProductBySlug } from "@/modules/products/hooks/useProducts";
import { useCategories } from "@/modules/categories/hooks/useCategories";
import { CATEGORY_SPECS } from "@/modules/products/config/category-specs.config";

const Card = ({ children }: { children: ReactNode }) => (
  <section className="rounded-2xl bg-white p-6">{children}</section>
);

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline gap-2 py-1.5 text-sm">
    <span className="shrink-0 text-foreground">{label}</span>
    <span className="min-w-4 flex-1 -translate-y-0.5 border-b border-dotted border-gray-300" />
    <span className="max-w-[55%] text-right text-muted-foreground">
      {value}
    </span>
  </div>
);

const ProductDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { data: categories = [] } = useCategories();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [descOpen, setDescOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);

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
    ) as string[];
  }, [product]);

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

  const category = categories.find((c) => c.id === product.categoryId);
  const specFields = category ? (CATEGORY_SPECS[category.slug] ?? []) : [];
  const attributes = product.attributes ?? {};
  const images =
    activeVariant.images.length > 0
      ? activeVariant.images
      : ["/placeholder.jpg"];
  const currentImage = images[activeImageIndex] ?? images[0];
  const inStock = activeVariant.stockQuantity > 0;

  const specs = specFields
    .filter((f) => attributes[f.key] !== undefined)
    .map((f) => {
      const v = attributes[f.key];
      const value =
        f.type === "boolean"
          ? v
            ? "Yes"
            : "No"
          : `${v}${f.unit ? ` ${f.unit}` : ""}`;
      return { label: f.label, value };
    });

  const keySpecs = specs.slice(0, 4);

  const { ram, storage, color } = activeVariant.attributes as {
    ram?: number;
    storage?: number;
    color?: string;
  };

  const { screenSize, mainCamera } = attributes as {
    screenSize?: number;
    mainCamera?: number;
  };

  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 bg-[#f0f1f2]" />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <h1 className="mt-1 text-xl font-bold">
              {product.name}
              {ram && storage
                ? ` ${ram}/${storage}GB/${screenSize}/${mainCamera} ${color}`
                : ""}
            </h1>

            <div className="mt-6 grid gap-6 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)]">
              {images.length > 1 && (
                <div className="order-2 flex gap-2 md:order-1 md:flex-col">
                  <button
                    onClick={() => setActiveImageIndex((prev) => prev - 1)}
                    disabled={activeImageIndex == 0}
                  >
                    prev
                  </button>
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-[64px] w-[64px] shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition ${
                        activeImageIndex === i
                          ? "border-primary"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${product.name} ${i + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveImageIndex((prev) => prev + 1)}
                    disabled={activeImageIndex >= images.length - 1}
                  >
                    next
                  </button>
                </div>
              )}

              {/* Main image */}
              <div
                className={`order-1 flex items-center justify-center md:order-2 ${
                  images.length > 1 ? "" : "md:col-span-1 md:col-start-2"
                }`}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  className="max-h-[400px] w-full object-contain"
                />
              </div>

              {/* Options + key specs */}
              <div className="order-3 flex flex-col gap-5">
                {colors.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-foreground">
                      Color:{" "}
                      <span className="text-muted-foreground">
                        {String(activeVariant.attributes.color ?? "")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => {
                        const isSelected =
                          activeVariant.attributes.color === color;
                        return (
                          <Button
                            key={color}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => {
                              setSelectedColor(color);
                              setActiveImageIndex(0);
                            }}
                          >
                            {color}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {storages.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-foreground">
                      Storage
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {storages.map((storage) => {
                        const isSelected =
                          String(activeVariant.attributes.storage) === storage;
                        return (
                          <Button
                            key={storage}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => setSelectedStorage(storage)}
                          >
                            {storage} GB
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {keySpecs.length > 0 && (
                  <div>
                    <div className="mb-1 text-sm font-semibold text-foreground">
                      Characteristics
                    </div>
                    {keySpecs.map((s) => (
                      <SpecRow key={s.label} {...s} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Card 2: description */}
          <Card>
            <h2 className="mb-4 text-xl font-bold">Description</h2>
            <div
              className={`relative overflow-hidden ${descOpen ? "" : "max-h-40"}`}
            >
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              {!descOpen && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>
            {product.description.length > 320 && (
              <button
                type="button"
                onClick={() => setDescOpen((v) => !v)}
                className="mx-auto mt-3 block text-sm font-medium text-blue-500 hover:text-blue-600"
              >
                {descOpen ? "Show less" : "Read more"}
              </button>
            )}
          </Card>

          {/* Card 3: characteristics */}
          {specs.length > 0 && (
            <Card>
              <h2 className="mb-4 text-xl font-bold">Characteristics</h2>
              <div className="relative overflow-hidden">
                {(specsOpen ? specs : specs.slice(0, 8)).map((s) => (
                  <SpecRow key={s.label} {...s} />
                ))}
              </div>
              {specs.length > 8 && (
                <button
                  type="button"
                  onClick={() => setSpecsOpen((v) => !v)}
                  className="mx-auto mt-3 block text-sm font-medium text-blue-500 hover:text-blue-600"
                >
                  {specsOpen ? "Show less" : "Show all"}
                </button>
              )}
            </Card>
          )}
        </div>

        <aside className="lg:sticky lg:top-20">
          <Card>
            <p className="text-xs text-muted-foreground">
              SKU: {activeVariant.sku}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl font-extrabold">
                ${activeVariant.price.toLocaleString("en-US")}
              </span>
              <Badge variant={inStock ? "default" : "destructive"}>
                {inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <Button size="lg" className="mt-5 w-full" disabled={!inStock}>
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
