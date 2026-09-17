export type FieldType = "text" | "number" | "boolean" | "select";

export interface SpecField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; // for select fields
  unit?: string; // unit of measurement (GB, in, mAh, etc.)
}

// Keyed by category slug (from backend Category.slug), not a hardcoded enum
export const CATEGORY_SPECS: Record<string, SpecField[]> = {
  // 1. SMARTPHONES
  smartphone: [
    { key: "ram", label: "RAM", type: "number", unit: "GB", required: true },
    {
      key: "storage",
      label: "Storage",
      type: "number",
      unit: "GB",
      required: true,
    },
    {
      key: "screenSize",
      label: "Screen Size",
      type: "number",
      unit: "in",
      required: true,
    },
    {
      key: "screenType",
      label: "Display Type",
      type: "select",
      options: ["AMOLED", "OLED", "IPS"],
      required: true,
    },
    { key: "refreshRate", label: "Refresh Rate", type: "number", unit: "Hz" },
    { key: "processor", label: "Processor", type: "text", required: true },
    {
      key: "battery",
      label: "Battery Capacity",
      type: "number",
      unit: "mAh",
    },
    { key: "mainCamera", label: "Main Camera", type: "number", unit: "MP" },
    { key: "frontCamera", label: "Front Camera", type: "number", unit: "MP" },
    {
      key: "os",
      label: "Operating System",
      type: "select",
      options: ["iOS", "Android"],
      required: true,
    },
    {
      key: "simType",
      label: "SIM Type",
      type: "select",
      options: ["Nano-SIM", "Dual SIM", "eSIM + Nano-SIM"],
    },
    { key: "color", label: "Color", type: "text", required: true },
    { key: "weight", label: "Weight", type: "number", unit: "g" },
    { key: "has5G", label: "5G Support", type: "boolean" },
    { key: "hasNfc", label: "NFC Support", type: "boolean" },
    { key: "eSimSupport", label: "eSIM Support", type: "boolean" },
  ],

  // 2. TABLETS
  tablet: [
    { key: "ram", label: "RAM", type: "number", unit: "GB", required: true },
    {
      key: "storage",
      label: "Storage",
      type: "number",
      unit: "GB",
      required: true,
    },
    {
      key: "screenSize",
      label: "Screen Size",
      type: "number",
      unit: "in",
      required: true,
    },
    {
      key: "screenType",
      label: "Display Type",
      type: "select",
      options: ["Liquid Retina", "AMOLED", "OLED", "IPS"],
      required: true,
    },
    { key: "processor", label: "Processor", type: "text", required: true },
    {
      key: "battery",
      label: "Battery Capacity",
      type: "number",
      unit: "mAh",
    },
    {
      key: "os",
      label: "Operating System",
      type: "select",
      options: ["iPadOS", "Android", "Windows"],
      required: true,
    },
    { key: "color", label: "Color", type: "text", required: true },
    { key: "stylusSupport", label: "Stylus Support", type: "boolean" },
    { key: "cellular", label: "Cellular (LTE/5G)", type: "boolean" },
    { key: "weight", label: "Weight", type: "number", unit: "g" },
  ],

  // 3. LAPTOPS
  laptop: [
    {
      key: "processor",
      label: "Processor (CPU)",
      type: "text",
      required: true,
    },
    { key: "ram", label: "RAM", type: "number", unit: "GB", required: true },
    {
      key: "storage",
      label: "SSD Capacity",
      type: "number",
      unit: "GB",
      required: true,
    },
    {
      key: "graphicsCard",
      label: "Graphics Card (GPU)",
      type: "text",
      required: true,
    },
    {
      key: "screenSize",
      label: "Screen Size",
      type: "number",
      unit: "in",
      required: true,
    },
    {
      key: "screenType",
      label: "Display Type",
      type: "select",
      options: ["OLED", "IPS", "TN"],
    },
    { key: "resolution", label: "Screen Resolution", type: "text" },
    {
      key: "os",
      label: "Operating System",
      type: "select",
      options: ["macOS", "Windows 11", "Linux", "No OS"],
      required: true,
    },
    { key: "batteryLife", label: "Battery Life", type: "number", unit: "h" },
    {
      key: "weight",
      label: "Weight",
      type: "number",
      unit: "kg",
      required: true,
    },
    { key: "color", label: "Color", type: "text", required: true },
  ],

  // 4. HEADPHONES
  headphones: [
    {
      key: "type",
      label: "Headphone Type",
      type: "select",
      options: ["TWS (Earbuds)", "In-ear", "On-ear", "Over-ear"],
      required: true,
    },
    {
      key: "connectionType",
      label: "Connection Type",
      type: "select",
      options: ["Wireless (Bluetooth)", "Wired", "Combined"],
      required: true,
    },
    {
      key: "anc",
      label: "Active Noise Cancellation (ANC)",
      type: "boolean",
    },
    {
      key: "batteryLife",
      label: "Battery Life (no case)",
      type: "number",
      unit: "h",
    },
    {
      key: "caseBatteryLife",
      label: "Battery Life (with case)",
      type: "number",
      unit: "h",
    },
    {
      key: "chargingInterface",
      label: "Charging Port",
      type: "select",
      options: ["USB-C", "Lightning", "Wireless (Qi)"],
    },
    { key: "microphone", label: "Built-in Microphone", type: "boolean" },
    { key: "waterResistance", label: "Water Resistance (IPX)", type: "text" },
    { key: "color", label: "Color", type: "text", required: true },
    {
      key: "weight",
      label: "Weight (earbud/total)",
      type: "number",
      unit: "g",
    },
  ],
};
