/** Human-readable redirect class names for SEO and migration reporting. */
export function redirectTypeLabel(status: number): string {
  switch (status) {
    case 301:
      return "301 Moved Permanently";
    case 302:
      return "302 Found (temporary)";
    case 303:
      return "303 See Other";
    case 307:
      return "307 Temporary Redirect";
    case 308:
      return "308 Permanent Redirect";
    default:
      return "";
  }
}

export function responseKind(status: number): string {
  if ([301, 302, 303, 307, 308].includes(status)) return "Redirect";
  if (status >= 200 && status < 300) return "Success";
  if (status >= 400 && status < 500) return "Client error";
  if (status >= 500) return "Server error";
  return "Response";
}

export function isRedirectStatus(status: number): boolean {
  return [301, 302, 303, 307, 308].includes(status);
}
