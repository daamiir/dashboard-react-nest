export type FieldType = "text" | "number" | "boolean" | "select";

export interface SpecField {
  key: string;
  label: string;
  type: FieldType;
  group?: string;
  required?: boolean;
  options?: string[]; // for select fields
  unit?: string; // unit of measurement (GB, in, mAh, etc.)
}

// Keyed by category slug (from backend Category.slug), not a hardcoded enum
export const CATEGORY_SPECS: Record<string, SpecField[]> = {
  // 1. SMARTPHONES
  smartphone: [
    {
      key: "cpuFrequency",
      label: "Frequency, GHz",
      type: "number",
      group: "Processor",
    },
    {
      key: "os",
      label: "Operating System",
      type: "text",
      required: true,
      group: "Processor",
    },
    {
      key: "processorBrand",
      label: "Processor Manufacturer",
      type: "text",
      group: "Processor",
    },
    {
      key: "processor",
      label: "Processor Model",
      type: "text",
      required: true,
      group: "Processor",
    },
    {
      key: "cpuCores",
      label: "Number of Cores",
      type: "number",
      group: "Processor",
    },

    {
      key: "simCount",
      label: "Number of SIM Cards",
      type: "number",
      group: "SIM Card",
    },
    {
      key: "simType",
      label: "SIM Card Size",
      type: "select",
      options: ["Nano-SIM", "Dual SIM", "eSIM + Nano-SIM"],
      group: "SIM Card",
    },

    {
      key: "resolution",
      label: "Display Resolution",
      type: "text",
      group: "Display",
    },
    {
      key: "screenSize",
      label: "Display Diagonal, in",
      type: "number",
      required: true,
      group: "Display",
    },
    {
      key: "refreshRate",
      label: "Refresh Rate",
      type: "number",
      unit: "Hz",
      group: "Display",
    },
    {
      key: "screenType",
      label: "Matrix Type",
      type: "select",
      options: ["AMOLED", "OLED", "IPS"],
      required: true,
      group: "Display",
    },

    {
      key: "battery",
      label: "Battery Capacity, mAh",
      type: "number",
      group: "Power",
    },

    {
      key: "autofocus",
      label: "Autofocus",
      type: "boolean",
      group: "Main Camera",
    },
    {
      key: "flash",
      label: "Built-in Flash",
      type: "boolean",
      group: "Main Camera",
    },
    {
      key: "stabilizationType",
      label: "Stabilization Method",
      type: "select",
      options: ["Optical", "Digital", "Optical + Digital"],
      group: "Main Camera",
    },
    {
      key: "stabilization",
      label: "Stabilization",
      type: "boolean",
      group: "Main Camera",
    },
    {
      key: "mainCamera",
      label: "Number of Megapixels",
      type: "number",
      group: "Main Camera",
    },

    {
      key: "port",
      label: "Connectors",
      type: "select",
      options: ["USB Type-C", "Lightning"],
      group: "Connectivity",
    },
    {
      key: "interfaces",
      label: "Interfaces",
      type: "text",
      group: "Connectivity",
    },
    {
      key: "networkStandard",
      label: "Network Standard",
      type: "select",
      options: ["4G", "5G"],
      group: "Connectivity",
    },

    {
      key: "series",
      label: "Series",
      type: "text",
      group: "Basic Specifications",
    },
    {
      key: "package",
      label: "Package Contents",
      type: "text",
      group: "Basic Specifications",
    },
    {
      key: "modelYear",
      label: "Model Year",
      type: "number",
      group: "Basic Specifications",
    },

    { key: "height", label: "Height, mm", type: "number", group: "Dimensions" },
    { key: "width", label: "Width, mm", type: "number", group: "Dimensions" },
    {
      key: "thickness",
      label: "Thickness, mm",
      type: "number",
      group: "Dimensions",
    },
    { key: "weight", label: "Weight, g", type: "number", group: "Dimensions" },

    {
      key: "bodyMaterial",
      label: "Body Material",
      type: "select",
      options: ["Glass", "Metal", "Plastic", "Ceramic"],
      group: "Features and Options",
    },
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
