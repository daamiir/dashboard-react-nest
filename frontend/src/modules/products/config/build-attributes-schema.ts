import * as z from "zod";
import { CATEGORY_SPECS, type SpecField } from "./category-specs.config";

function fieldSchema(field: SpecField): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case "number":
      schema = z.coerce.number({
        message: `${field.label} must be a number`,
      });
      break;
    case "boolean":
      schema = z.boolean();
      break;
    case "select":
      schema = field.options
        ? z.enum(field.options as [string, ...string[]])
        : z.string();
      break;
    case "text":
    default:
      schema = z.string();
      break;
  }

  if (!field.required) {
    schema = schema.optional();
  } else if (field.type === "text" || field.type === "select") {
    schema = (schema as z.ZodString).min(1, `${field.label} is required`);
  }

  return schema;
}

export function buildAttributesSchema(category: string) {
  const fields = CATEGORY_SPECS[category];
  if (!fields) return z.record(z.string(), z.unknown());

  const shape = Object.fromEntries(
    fields.map((field) => [field.key, fieldSchema(field)]),
  );

  return z.object(shape);
}
