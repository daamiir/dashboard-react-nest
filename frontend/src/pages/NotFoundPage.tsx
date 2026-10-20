import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const { pathname } = useLocation();
  const homePath = pathname.startsWith("/admin") ? "/admin" : "/";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 py-12 text-center md:gap-12 md:py-20">
      <style>{`
        .nf-float { animation: nf-float 4s ease-in-out infinite; }
        @keyframes nf-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
      <svg
        viewBox="0 0 272 150"
        className="nf-float w-full max-w-xs text-primary sm:max-w-sm md:max-w-md"
        role="img"
        aria-label="404"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="110"
          fontWeight="800"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          404
        </text>
      </svg>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Page not found
          </h1>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground sm:text-base">
            The page you are looking for does not exist or was moved.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to={homePath}>Home</Link>
        </Button>
      </div>
    </div>
  );
}
