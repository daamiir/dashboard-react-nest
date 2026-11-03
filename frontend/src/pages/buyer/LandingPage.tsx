import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "@/modules/products/hooks/useProducts";
import { ProductCard } from "@/pages/buyer/ProductsPage";
import { WishlistButton } from "@/modules/wishlist/components/WishlistButton";
import type { Product, ProductVariant } from "@/modules/products/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, BadgeCheck, ShieldCheck } from "lucide-react";
import HERO_IMAGE from "@/assets/galaxy-s26ultra-hero-horizontal.webp";
import PROMO_1 from "@/assets/galaxy-watch9-promo-horizontal.webp";
import PROMO_2 from "@/assets/galaxy-buds4pro-white-promo-horizontal.webp";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type Promo = {
  image: string;
  href: string;
  alt: string;
};

const TABS = [
  "New Arrivals",
  "Ongoing Offers",
  "Featured Products",
  "Best Sellers",
];

const promos: Promo[] = [
  { image: PROMO_1, href: "/shop", alt: "Promo 1" },
  { image: PROMO_2, href: "/shop", alt: "Promo 2" },
];

const features = [
  {
    icon: BadgeCheck,
    title: "Official dealer",
    text: "Authorized Samsung seller with full warranty.",
  },
  {
    icon: Truck,
    title: "Fast delivery",
    text: "Reliable delivery across the city.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Your payments and data are always protected.",
  },
];

const SectionHeader = ({
  title,
  to,
  children,
}: {
  title?: string;
  to: string;
  children?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4 border-b pb-3">
    {title ? (
      <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
    ) : (
      <div />
    )}
    <div className="flex items-center gap-4">
      {children}
      <Button
        variant="outline"
        size="sm"
        className="border-red-600 text-red-600 hover:text-red-600"
        asChild
      >
        <Link to={to}>
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </div>
);

type Tile = { product: Product; variant: ProductVariant };

const ProductGrid = ({ items }: { items: Tile[] }) => {
  const navigate = useNavigate();
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map(({ product, variant }) => (
        <div key={variant.id} className="relative grid">
          <ProductCard
            product={product}
            variant={variant}
            onOpen={() =>
              navigate(
                `/shop/${product.slug}?variant=${encodeURIComponent(variant.sku)}`,
              )
            }
          />
          <WishlistButton
            product={product}
            variant={variant}
            className="absolute right-4 top-4 size-8"
          />
        </div>
      ))}
    </div>
  );
};

const LandingPage = () => {
  const [tab, setTab] = useState(TABS[0]);
  const [email, setEmail] = useState("");

  const { data } = useProducts({ page: 1, limit: 8 });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to backend when a subscribe endpoint exists
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  const tiles: Tile[] = (data?.data ?? []).flatMap((p) =>
    p.variants.map((v) => ({ product: p, variant: v })),
  );
  const deals = tiles.slice(0, 4);
  const activeItems = tiles.slice(0, 8);

  return (
    <div className="flex flex-col gap-12 py-6">
      {/* Hero banner */}
      {HERO_IMAGE && (
        <section>
          <Link to="/shop" className="block overflow-hidden rounded-xl">
            <img
              src={HERO_IMAGE}
              alt="Hero banner"
              fetchPriority="high"
              className="aspect-2/1 w-full object-cover"
            />
          </Link>
        </section>
      )}

      {/* Feature cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex items-start gap-4 rounded-md border bg-card p-5"
          >
            <Icon className="h-10 w-10 shrink-0" strokeWidth={1.5} />
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Deals of the week */}
      {deals.length > 0 && (
        <section>
          <SectionHeader title="Deals of the Week" to="/shop" />
          <ProductGrid items={deals} />
        </section>
      )}

      {/* Promo banners */}
      {promos.length > 0 && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {promos.map((b) => (
            <Link
              key={b.alt}
              to={b.href}
              className="block overflow-hidden rounded-xl"
            >
              <img
                src={b.image}
                alt={b.alt}
                loading="lazy"
                decoding="async"
                className="aspect-7/5 w-full object-cover"
              />
            </Link>
          ))}
        </section>
      )}

      {/* Tabbed products */}
      <section>
        <SectionHeader to="/shop">
          <div className="hidden gap-5 text-sm font-medium text-muted-foreground sm:flex">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  t === tab ? "text-foreground" : "hover:text-foreground"
                }
              >
                {t}
              </button>
            ))}
          </div>
        </SectionHeader>
        {activeItems.length > 0 && <ProductGrid items={activeItems} />}
      </section>

      {/* Newsletter */}
      <section className="grid items-center gap-6 rounded-md border bg-card p-8 md:grid-cols-2 md:p-12">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Subscribe to our newsletter
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get exclusive updates, promotions and news delivered straight to
            your inbox.
          </p>
        </div>
        <form onSubmit={handleSubscribe} className="flex gap-3">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="h-12 bg-muted"
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 bg-red-600 text-white hover:bg-red-700"
          >
            Subscribe
          </Button>
        </form>
      </section>
    </div>
  );
};

export default LandingPage;
