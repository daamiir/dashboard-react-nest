// Label and value joined by a dotted leader
export const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline gap-2 py-1.5 text-sm">
    <span className="shrink-0 text-foreground">{label}</span>
    <span className="min-w-4 flex-1 -translate-y-0.5 border-b border-dotted border-gray-300" />
    <span className="max-w-[55%] text-right text-muted-foreground">
      {value}
    </span>
  </div>
);
