import { Resolver } from "node:dns/promises";

/**
 * Default to well-known recursive resolvers so lookups work when the OS resolver
 * is unreachable (common on some Windows/VPN setups) or refuses UDP (ECONNREFUSED).
 * Override with DNS_LOOKUP_SERVERS="8.8.8.8,1.1.1.1" if needed.
 */
function resolverServers(): string[] {
  const env = process.env.DNS_LOOKUP_SERVERS?.trim();
  if (env) {
    const parts = env.split(/[\s,]+/).filter(Boolean);
    if (parts.length > 0) return parts;
  }
  return ["8.8.8.8", "1.1.1.1"];
}

/** Fresh Resolver per request avoids shared c-ares channel races (EDESTRUCTION). */
export function createPublicDnsResolver(): Resolver {
  const r = new Resolver();
  r.setServers(resolverServers());
  return r;
}
