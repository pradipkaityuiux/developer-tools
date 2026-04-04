/** Google-style snippet limits are guidelines; engines truncate by pixels and rewrite text. */

export const TITLE_IDEAL_MAX = 60;
export const TITLE_WARNING_MAX = 70;
export const DESC_IDEAL_MIN = 120;
export const DESC_IDEAL_MAX = 160;
export const DESC_WARNING_MAX = 170;

export type LengthBand = "empty" | "short" | "ideal" | "long" | "very-long";

export function titleBand(length: number): LengthBand {
  if (length === 0) return "empty";
  if (length < 30) return "short";
  if (length <= TITLE_IDEAL_MAX) return "ideal";
  if (length <= TITLE_WARNING_MAX) return "long";
  return "very-long";
}

export function descriptionBand(length: number): LengthBand {
  if (length === 0) return "empty";
  if (length < 70) return "short";
  if (length <= DESC_IDEAL_MAX) return "ideal";
  if (length <= DESC_WARNING_MAX) return "long";
  return "very-long";
}

export function bandLabel(kind: "title" | "description", band: LengthBand): string {
  if (kind === "title") {
    switch (band) {
      case "empty":
        return "Add a title";
      case "short":
        return "Quite short — consider expanding with the main keyword";
      case "ideal":
        return "Within a typical visible range for many SERP layouts";
      case "long":
        return "May truncate in some result layouts";
      case "very-long":
        return "Likely truncated — tighten or front-load the message";
      default:
        return "";
    }
  }
  switch (band) {
    case "empty":
      return "Add a meta description";
    case "short":
      return "Short — you may have room to add benefits or a CTA";
    case "ideal":
      return "Fits common snippet width targets";
    case "long":
      return "Could truncate on some devices";
    case "very-long":
      return "Often truncated — shorten or move detail on-page";
    default:
      return "";
  }
}
