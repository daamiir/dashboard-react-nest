import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, ShieldCheck, ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 sm:py-28 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Everything you need,
          <br className="hidden sm:block" /> from sellers you trust
        </h1>
        <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
          Discover products from independent sellers, all in one place.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/shop">
              Start shopping
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/signup">Create account</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-t">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Wide selection</h3>
            <p className="text-sm text-muted-foreground">
              Thousands of products across every category.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Fast delivery</h3>
            <p className="text-sm text-muted-foreground">
              Reliable shipping from sellers near you.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Secure checkout</h3>
            <p className="text-sm text-muted-foreground">
              Your payments and data are always protected.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t text-center">
        <h2 className="text-2xl font-semibold">Ready to find what you need?</h2>
        <p className="mt-2 text-muted-foreground">
          Browse the full catalog and start shopping today.
        </p>
        <Button size="lg" className="mt-6" asChild>
          <Link to="/shop">Browse products</Link>
        </Button>
      </section>
    </div>
  );
};

export default LandingPage;
