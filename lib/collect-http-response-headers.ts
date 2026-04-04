export type HeaderRow = { name: string; value: string };

/**
 * Normalizes Fetch API Headers into a sorted list, including multiple Set-Cookie
 * values when Node exposes `getSetCookie`.
 */
export function collectHeadersFromResponse(res: Response): HeaderRow[] {
  const rows: HeaderRow[] = [];
  const headers = res.headers;
  const getSetCookie = (
    headers as unknown as { getSetCookie?: () => string[] }
  ).getSetCookie;

  headers.forEach((value, name) => {
    if (name.toLowerCase() === "set-cookie" && typeof getSetCookie === "function") {
      return;
    }
    rows.push({ name, value });
  });

  if (typeof getSetCookie === "function") {
    for (const cookie of getSetCookie.call(headers)) {
      rows.push({ name: "set-cookie", value: cookie });
    }
  }

  rows.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
  return rows;
}
