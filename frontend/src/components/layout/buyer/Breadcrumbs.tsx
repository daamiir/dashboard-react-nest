import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = { label: string; to?: string };

const prettifySlug = (slug: string) => {
  const text = decodeURIComponent(slug).replace(/-/g, " ");
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const buildCrumbs = (pathname: string): Crumb[] => {
  const crumbs: Crumb[] = [{ label: "Home", to: "/" }];
  const [section, slug] = pathname.split("/").filter(Boolean);

  if (section === "shop") {
    crumbs.push({ label: "Shop", to: "/shop" });
    if (slug) crumbs.push({ label: prettifySlug(slug) });
  } else if (section === "cart") {
    crumbs.push({ label: "Cart" });
  } else if (section === "wishlist") {
    crumbs.push({ label: "Wishlist" });
  } else if (section === "checkout") {
    crumbs.push({ label: "Checkout" });
  }

  return crumbs;
};

const BuyerBreadcrumbs = () => {
  const { pathname } = useLocation();
  const crumbs = buildCrumbs(pathname);
  const lastIndex = crumbs.length - 1;

  // No breadcrumb on the landing page
  if (crumbs.length === 1) return null;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.label}>
            <BreadcrumbItem>
              {/* Last crumb is the current page, not a link */}
              {i === lastIndex || !crumb.to ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.to}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i < lastIndex && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BuyerBreadcrumbs;
