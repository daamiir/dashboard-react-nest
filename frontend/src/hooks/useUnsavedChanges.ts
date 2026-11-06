import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FieldValues, UseFormReturn } from "react-hook-form";

const serialize = (v: unknown) =>
  JSON.stringify(v, (_, x) => {
    if (typeof x === "number") return String(x);
    if (x === "" || x === null || x === false) return undefined;
    return x;
  });

export function useFormChanges<T extends FieldValues>(form: UseFormReturn<T>) {
  const [baseline, setBaseline] = useState(() => serialize(form.getValues()));
  const current = serialize(form.watch());

  const markClean = useCallback(() => {
    setBaseline(serialize(form.getValues()));
  }, [form]);

  return { changed: current !== baseline, markClean };
}

export function useUnsavedChanges(changed: boolean) {
  const navigate = useNavigate();
  const bypass = useRef(false);
  const pending = useRef<(() => void) | null>(null);
  const [open, setOpen] = useState(false);

  const requestLeave = useCallback(
    (action: () => void) => {
      if (!changed || bypass.current) return action();
      pending.current = action;
      setOpen(true);
    },
    [changed],
  );

  useEffect(() => {
    if (!changed) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!bypass.current) e.preventDefault();
    };

    const onClick = (e: MouseEvent) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank") return;
      if (a.origin !== window.location.origin) return;
      if (a.pathname === window.location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      pending.current = () => navigate(a.pathname + a.search + a.hash);
      setOpen(true);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [changed, navigate]);

  const leaveDialog = {
    open,
    onOpenChange: setOpen,
    title: "Unsaved changes",
    description: "You have unsaved changes. Leave this page?",
    confirmLabel: "Leave",
    onConfirm: () => {
      bypass.current = true;
      pending.current?.();
    },
  };

  return { bypass, requestLeave, leaveDialog };
}
