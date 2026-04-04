/**
 * Builds Apache .htaccess snippets from toggles. Intended for Apache 2.4+ with
 * common modules (mod_rewrite, mod_headers, mod_expires, mod_deflate).
 */

export type CanonicalHostMode = "none" | "force-non-www" | "force-www";

export type HtaccessGeneratorOptions = {
  /** Base: Options +FollowSymLinks and RewriteEngine On */
  enableRewrite: boolean;
  forceHttps: boolean;
  canonicalHost: CanonicalHostMode;
  /** Redirect /path/ to /path when not a real directory */
  removeTrailingSlash: boolean;
  blockSensitiveFiles: boolean;
  disableDirectoryListing: boolean;
  blockHotlinking: boolean;
  /** Primary hostname without scheme, e.g. example.com (used in hotlink rules) */
  hotlinkPrimaryHost: string;
  enableGzip: boolean;
  enableBrowserCache: boolean;
  securityHeaders: boolean;
  utf8Charset: boolean;
  customError404: string;
};

export type CustomRedirect = {
  /** Path starting with / */
  fromPath: string;
  /** Absolute URL or path */
  toTarget: string;
};

export const DEFAULT_HTACCESS_OPTIONS: HtaccessGeneratorOptions = {
  enableRewrite: true,
  forceHttps: true,
  canonicalHost: "none",
  removeTrailingSlash: false,
  blockSensitiveFiles: true,
  disableDirectoryListing: true,
  blockHotlinking: false,
  hotlinkPrimaryHost: "example.com",
  enableGzip: true,
  enableBrowserCache: true,
  securityHeaders: true,
  utf8Charset: true,
  customError404: "",
};

function escapeRegexHost(host: string): string {
  return host.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePath(p: string): string {
  const t = p.trim();
  if (!t) return "/";
  return t.startsWith("/") ? t : `/${t}`;
}

/** Path after RewriteBase / in per-dir context (no leading slash). */
function pathToRewritePattern(from: string): string | null {
  const n = normalizePath(from);
  if (n === "/") return null;
  const tail = n.replace(/^\/+/, "");
  if (!tail) return null;
  const escaped = tail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return `${escaped}/?$`;
}

export function buildHtaccessContent(
  options: HtaccessGeneratorOptions,
  redirects: CustomRedirect[],
): string {
  const blocks: string[] = [];
  const header = [
    "# Generated with Zero Snippet — review before production.",
    "# Apache 2.4+; requires AllowOverride for relevant directives.",
    "",
  ];
  blocks.push(header.join("\n"));

  const needsRewriteBlock =
    options.enableRewrite ||
    options.forceHttps ||
    options.canonicalHost !== "none" ||
    options.removeTrailingSlash ||
    redirects.length > 0 ||
    options.blockHotlinking ||
    options.blockSensitiveFiles;

  if (options.utf8Charset) {
    blocks.push(
      [
        "# --- Character encoding ---",
        "AddDefaultCharset UTF-8",
        "",
      ].join("\n"),
    );
  }

  const optionsLines: string[] = [];
  if (options.disableDirectoryListing) {
    optionsLines.push("Options -Indexes");
  }
  if (needsRewriteBlock && optionsLines.length === 0) {
    optionsLines.push("Options +FollowSymLinks");
  } else if (needsRewriteBlock) {
    optionsLines.unshift("Options +FollowSymLinks");
  }
  if (optionsLines.length) {
    blocks.push(["# --- Options ---", ...optionsLines, ""].join("\n"));
  }

  if (options.blockSensitiveFiles) {
    blocks.push(
      [
        "# --- Block .env at web root ---",
        "<Files \".env\">",
        "  Require all denied",
        "</Files>",
        "",
      ].join("\n"),
    );
  }

  if (needsRewriteBlock) {
    const rewrite: string[] = [
      "# --- mod_rewrite ---",
      "<IfModule mod_rewrite.c>",
      "  RewriteEngine On",
      "  RewriteBase /",
    ];

    if (options.forceHttps) {
      rewrite.push(
        "  # Force HTTPS",
        "  RewriteCond %{HTTPS} !=on",
        "  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]",
      );
    }

    if (options.canonicalHost !== "none") {
      if (options.canonicalHost === "force-non-www") {
        rewrite.push(
          "  # Canonical: strip www",
          "  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]",
          "  RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]",
        );
      } else {
        rewrite.push(
          "  # Canonical: add www",
          "  RewriteCond %{HTTP_HOST} !^www\\. [NC]",
          "  RewriteRule ^ https://www.%{HTTP_HOST}%{REQUEST_URI} [R=301,L]",
        );
      }
    }

    if (options.blockSensitiveFiles) {
      rewrite.push(
        "  # Block .git and similar from web access",
        "  RewriteRule ^(\\.git|\\.svn|\\.hg)(/|$) - [F,L]",
      );
    }

    if (options.removeTrailingSlash) {
      rewrite.push(
        "  # Remove trailing slash (not for real directories)",
        "  RewriteCond %{REQUEST_FILENAME} !-d",
        "  RewriteCond %{REQUEST_URI} (.+)/$",
        "  RewriteRule ^ %1 [R=301,L]",
      );
    }

    for (const r of redirects) {
      const from = normalizePath(r.fromPath);
      const to = r.toTarget.trim();
      const pat = pathToRewritePattern(from);
      if (!pat || !to) continue;
      rewrite.push(
        `  # Redirect: ${from} → ${to}`,
        `  RewriteRule ^${pat} ${to} [R=301,L]`,
      );
    }

    if (options.blockHotlinking) {
      const host = options.hotlinkPrimaryHost.trim() || "example.com";
      const esc = escapeRegexHost(host);
      rewrite.push(
        "  # Hotlink protection (images/media)",
        "  RewriteCond %{HTTP_REFERER} !^$",
        `  RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?${esc} [NC]`,
        "  RewriteRule \\.(gif|jpe?g|png|webp|svg|avif|ico|css|js)$ - [F,L]",
      );
    }

    rewrite.push("</IfModule>", "");
    blocks.push(rewrite.join("\n"));
  } else {
    if (options.blockSensitiveFiles) {
      blocks.push(
        [
          "# --- Block .git (mod_alias; enable mod_rewrite above for HTTPS/redirects) ---",
          "<IfModule mod_alias.c>",
          "  RedirectMatch 404 \\.git(/|$)",
          "</IfModule>",
          "",
        ].join("\n"),
      );
    }
    if (redirects.length) {
      const redirBlock = [
        "# --- Redirect (mod_alias) ---",
        "<IfModule mod_alias.c>",
      ];
      for (const r of redirects) {
        const from = normalizePath(r.fromPath);
        const to = r.toTarget.trim();
        if (!from || from === "/" || !to) continue;
        redirBlock.push(`  Redirect 301 ${from} ${to}`);
      }
      redirBlock.push("</IfModule>", "");
      blocks.push(redirBlock.join("\n"));
    }
  }

  if (options.customError404.trim()) {
    const p = options.customError404.trim();
    blocks.push(
      [
        "# --- Custom error document ---",
        `ErrorDocument 404 ${p.startsWith("/") ? p : `/${p}`}`,
        "",
      ].join("\n"),
    );
  }

  if (options.securityHeaders) {
    blocks.push(
      [
        "# --- Security headers (mod_headers) ---",
        "<IfModule mod_headers.c>",
        '  Header set X-Frame-Options "SAMEORIGIN"',
        '  Header set X-Content-Type-Options "nosniff"',
        '  Header set Referrer-Policy "strict-origin-when-cross-origin"',
        "  Header set X-XSS-Protection \"1; mode=block\"",
        "</IfModule>",
        "",
      ].join("\n"),
    );
  }

  if (options.enableGzip) {
    blocks.push(
      [
        "# --- Compression (mod_deflate) ---",
        "<IfModule mod_deflate.c>",
        "  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css",
        "  AddOutputFilterByType DEFLATE application/javascript application/json application/xml",
        "  AddOutputFilterByType DEFLATE image/svg+xml",
        "</IfModule>",
        "",
      ].join("\n"),
    );
  }

  if (options.enableBrowserCache) {
    blocks.push(
      [
        "# --- Browser caching (mod_expires) ---",
        "<IfModule mod_expires.c>",
        "  ExpiresActive On",
        "  ExpiresByType image/jpeg \"access plus 1 year\"",
        "  ExpiresByType image/png \"access plus 1 year\"",
        "  ExpiresByType image/webp \"access plus 1 year\"",
        "  ExpiresByType image/svg+xml \"access plus 1 year\"",
        "  ExpiresByType image/x-icon \"access plus 1 year\"",
        "  ExpiresByType text/css \"access plus 1 month\"",
        "  ExpiresByType application/javascript \"access plus 1 month\"",
        "  ExpiresByType font/woff2 \"access plus 1 year\"",
        "</IfModule>",
        "",
      ].join("\n"),
    );
  }

  return blocks.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
