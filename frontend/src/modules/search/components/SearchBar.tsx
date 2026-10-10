import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, LayoutGrid, Loader2, Search, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { productImage } from "@/lib/image";
import { useCategories } from "@/modules/categories/hooks/useCategories";
import { useProducts } from "@/modules/products/hooks/useProducts";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { Highlight } from "./Highlight";
import type { ProductVariant } from "@/modules/products/types";
import { formatPrice, variantTitle } from "@/modules/products/utils";

type Section = "history" | "suggestion" | "category" | "product";

interface Item {
  id: string;
  section: Section;
  label: string;
  to: string;
  image?: string | null;
  price?: number;
}

const resultsUrl = (term: string) => "/shop?q=" + encodeURIComponent(term);
const categoryUrl = (id: string) => "/shop?category=" + id;

const MAX_RESULTS = 8;

const variantUrl = (slug: string, v: ProductVariant) => {
  const params = new URLSearchParams();
  if (v.attributes.color) params.set("color", String(v.attributes.color));
  if (v.attributes.storage) params.set("storage", String(v.attributes.storage));
  const qs = params.toString();
  return "/shop/" + slug + (qs ? "?" + qs : "");
};

const ROW_ICON = {
  suggestion: Search,
  category: LayoutGrid,
} as const;

export const SearchBar = () => {
  const navigate = useNavigate();
  const { items: recent, add, remove, clear } = useRecentSearches();
  const { data: categories = [] } = useCategories();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const term = query.trim();
  const lower = term.toLowerCase();
  const debounced = useDebounce(term, 300);
  // Ignore the old debounced value right after typing starts or the box is cleared
  const effective = term ? debounced : "";
  const wantProducts = effective ? effective.length >= 2 : !term;
  const { data, isFetching } = useProducts(
    effective ? { search: effective, limit: 6 } : { limit: 6 },
    open && wantProducts,
  );
  const products = wantProducts ? (data?.data ?? []) : [];
  // Spinner while debouncing or fetching
  const busy = term.length >= 2 && (term !== debounced || isFetching);

  // Query suggestions: matching brands and past searches
  const suggestionLabels = Array.from(
    new Set([
      ...products.map((p) => p.brand),
      ...recent.filter((r) => r.toLowerCase().includes(lower)),
    ]),
  )
    .filter((l) => l.toLowerCase() !== lower)
    .slice(0, 4);

  const left: Item[] = term
    ? [
        {
          id: "term",
          section: "suggestion",
          label: term,
          to: resultsUrl(term),
        },
        ...suggestionLabels.map((l) => ({
          id: "s-" + l,
          section: "suggestion" as const,
          label: l,
          to: resultsUrl(l),
        })),
        ...categories
          .filter((c) => c.name.toLowerCase().includes(lower))
          .slice(0, 5)
          .map((c) => ({
            id: "c-" + c.id,
            section: "category" as const,
            label: c.name,
            to: categoryUrl(c.id),
          })),
      ]
    : [
        ...recent.map((t) => ({
          id: "h-" + t,
          section: "history" as const,
          label: t,
          to: resultsUrl(t),
        })),
        ...categories.slice(0, 8).map((c) => ({
          id: "c-" + c.id,
          section: "category" as const,
          label: c.name,
          to: categoryUrl(c.id),
        })),
      ];

  const right: Item[] = products
    .flatMap((p) =>
      p.variants.map((v) => ({
        id: "v-" + v.id,
        section: "product" as const,
        label: variantTitle(p, v),
        to: variantUrl(p.slug, v),
        image: v.images[0] ?? null,
        price: v.price,
      })),
    )
    .slice(0, MAX_RESULTS);

  const noResults = !!term && wantProducts && !busy && right.length === 0;

  // Arrow keys move through the left column, then the right one
  const items = [...left, ...right];
  const of = (s: Section) => items.filter((i) => i.section === s);
  const showList = open && (!!term || items.length > 0);
  const optionId = (i: number) => listId + "-" + i;

  const close = () => {
    setOpen(false);
    setMobileOpen(false);
    setActive(-1);
    inputRef.current?.blur();
  };

  const select = (item: Item) => {
    if (item.section === "history" || item.section === "suggestion") {
      setQuery(item.label);
      add(item.label);
    }
    close();
    navigate(item.to);
  };

  const submit = () => {
    if (!term) return;
    add(term);
    close();
    navigate(resultsUrl(term));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (items.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) =>
        i < 0
          ? step > 0
            ? 0
            : items.length - 1
          : (i + step + items.length) % items.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[active];
      if (item) select(item);
      else submit();
    } else if (e.key === "Escape") {
      close();
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Global hotkeys: Ctrl/Cmd + K, or "/" outside inputs
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing =
        el.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      const isK = e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey);
      if (isK || (e.key === "/" && !typing)) {
        e.preventDefault();
        setMobileOpen(true);
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the input when the mobile overlay opens
  useEffect(() => {
    if (mobileOpen) inputRef.current?.focus();
  }, [mobileOpen]);

  // Lock page scroll while the mobile overlay is open
  useEffect(() => {
    if (!mobileOpen || window.matchMedia("(min-width: 768px)").matches) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Shared option attributes for keyboard and mouse
  const optionProps = (item: Item) => {
    const i = items.indexOf(item);
    return {
      id: optionId(i),
      role: "option" as const,
      "aria-selected": i === active,
      onMouseDown: (e: ReactMouseEvent) => e.preventDefault(),
      onMouseEnter: () => setActive(i),
      onClick: () => select(item),
    };
  };
  const isActive = (item: Item) => items.indexOf(item) === active;

  const section = (title: string, body: ReactNode, action?: ReactNode) => (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        {action}
      </div>
      {body}
    </div>
  );

  // Suggestion, category and page rows with an arrow
  const renderRow = (item: Item) => {
    const Icon = ROW_ICON[item.section as keyof typeof ROW_ICON];
    return (
      <div
        key={item.id}
        {...optionProps(item)}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
          isActive(item) && "bg-muted",
        )}
      >
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate">
          <Highlight text={item.label} query={term} />
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </div>
    );
  };

  // History and category chips for the empty state
  const renderChip = (item: Item) => (
    <div
      key={item.id}
      {...optionProps(item)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm",
        isActive(item) && "ring-2 ring-ring/50",
      )}
    >
      <span>{item.label}</span>
      {item.section === "history" && (
        <button
          type="button"
          aria-label={"Remove " + item.label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            remove(item.label);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );

  const renderProduct = (item: Item) => (
    <div
      key={item.id}
      {...optionProps(item)}
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-lg px-2 py-2.5",
        isActive(item) && "bg-muted",
      )}
    >
      <div className="size-14 shrink-0 overflow-hidden rounded-md border bg-white p-1">
        {item.image && (
          <img
            src={productImage(item.image, { width: 112 })}
            alt=""
            className="h-full w-full object-contain"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm">
          <Highlight text={item.label} query={term} />
        </p>
        {item.price !== undefined && (
          <p className="mt-0.5 text-sm font-bold">{formatPrice(item.price)}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 justify-end md:justify-center md:px-6">
      {/* Mobile trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open search"
        onClick={() => setMobileOpen(true)}
      >
        <Search />
      </Button>

      {/* Dim the page below the header */}
      {open && (
        <div
          aria-hidden
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/30 max-md:hidden"
        />
      )}

      <div
        ref={boxRef}
        className={cn(
          "relative w-full max-w-xl",
          mobileOpen
            ? "max-md:fixed max-md:inset-0 max-md:z-[60] max-md:bg-background max-md:p-4"
            : "max-md:hidden",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
            </span>

            <input
              ref={inputRef}
              role="combobox"
              aria-expanded={showList}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? optionId(active) : undefined}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(-1);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search products"
              className="h-10 w-full rounded-full border bg-background pl-9 pr-14 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />

            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery("");
                  setActive(-1);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border px-1.5 text-xs text-muted-foreground md:inline">
                /
              </kbd>
            )}
          </div>

          {mobileOpen && (
            <Button variant="ghost" className="md:hidden" onClick={close}>
              Cancel
            </Button>
          )}
        </div>

        {showList && (
          <div
            id={listId}
            role="listbox"
            className="fixed left-1/2 top-[4.25rem] z-50 grid max-h-[calc(100vh-5.5rem)] w-[min(64rem,calc(100vw-2rem))] -translate-x-1/2 overflow-y-auto rounded-xl border bg-popover shadow-lg md:grid-cols-[2fr_3fr] max-md:static max-md:mt-3 max-md:max-h-none max-md:w-full max-md:translate-x-0 max-md:border-0 max-md:shadow-none"
          >
            {/* Left column */}
            <div className="p-4 md:border-r">
              {term ? (
                <>
                  {section(
                    "Maybe you're looking for",
                    of("suggestion").map(renderRow),
                  )}
                  {of("category").length > 0 &&
                    section("Categories", of("category").map(renderRow))}
                </>
              ) : (
                <>
                  {of("history").length > 0 &&
                    section(
                      "Search history",
                      <div className="flex flex-wrap gap-2">
                        {of("history").map(renderChip)}
                      </div>,
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={clear}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </button>,
                    )}
                  {of("category").length > 0 &&
                    section(
                      "Categories",
                      <div className="flex flex-wrap gap-2">
                        {of("category").map(renderChip)}
                      </div>,
                    )}
                </>
              )}
            </div>

            {/* Right column */}
            <div className="p-4">
              {section(
                "Products",
                noResults ? (
                  <p className="px-2 py-3 text-sm text-muted-foreground">
                    {'No products found for "' + term + '"'}
                  </p>
                ) : right.length === 0 && wantProducts ? (
                  <p className="px-2 py-3 text-sm text-muted-foreground">
                    Searching...
                  </p>
                ) : (
                  <div>{of("product").map(renderProduct)}</div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
