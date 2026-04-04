/** Browser-side format (Prettier) and minify (Terser). */

export type JsProcessOk = { ok: true; value: string };
export type JsProcessErr = { ok: false; error: string };

export async function formatJs(source: string): Promise<JsProcessOk | JsProcessErr> {
  const trimmed = source.replace(/^\uFEFF/, "");
  if (!trimmed.trim()) {
    return { ok: true, value: trimmed };
  }

  try {
    const prettier = await import("prettier/standalone");
    const babel = await import("prettier/plugins/babel");
    const estree = await import("prettier/plugins/estree");

    const formatted = await prettier.format(trimmed, {
      parser: "babel-ts",
      plugins: [babel, estree],
      semi: true,
      singleQuote: false,
      trailingComma: "es5",
      printWidth: 88,
      tabWidth: 2,
      arrowParens: "always",
      bracketSpacing: true,
    });
    return { ok: true, value: formatted };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

export async function minifyJs(source: string): Promise<JsProcessOk | JsProcessErr> {
  const trimmed = source.replace(/^\uFEFF/, "");
  if (!trimmed.trim()) {
    return { ok: true, value: trimmed };
  }

  try {
    const { minify } = await import("terser");
    /** `module: true` tree-shakes unused top-level bindings; avoid it for plain scripts. */
    const moduleMode =
      /\bexport\b/.test(trimmed) || /import\s+[\w*{/"']/.test(trimmed);

    const result = await minify(trimmed, {
      compress: {
        passes: 2,
        dead_code: true,
        drop_console: false,
      },
      mangle: true,
      format: {
        comments: false,
      },
      module: moduleMode,
    });

    if (!result.code) {
      return { ok: false, error: "Terser returned no output." };
    }
    return { ok: true, value: result.code };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: msg.includes("Unexpected token") || msg.includes("Parse error")
        ? `${msg} If this is TypeScript, strip types or use Format only—minify expects runnable JavaScript.`
        : msg,
    };
  }
}
