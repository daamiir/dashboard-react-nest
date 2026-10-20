export type Spec = { key: string; label: string };
export type Errors = Record<string, string>;

export const VARIANT_SPECS: Record<string, Spec[]> = {
  smartphone: [
    { key: "color", label: "Color" },
    { key: "ram", label: "RAM (GB)" },
    { key: "storage", label: "Storage (GB)" },
  ],
};

export const validateSpecs = (
  a: Record<string, unknown> = {},
  specs: Spec[],
) => {
  const errors: Errors = {};
  if (specs.length === 0) errors._ = "Select a category first";
  for (const s of specs) {
    const v = a[s.key];
    const ok =
      s.key === "color" ? String(v ?? "").trim() !== "" : Number(v) > 0;
    if (!ok) errors[s.key] = `${s.label.split(" (")[0]} is required`;
  }
  return errors;
};

export default VARIANT_SPECS;
