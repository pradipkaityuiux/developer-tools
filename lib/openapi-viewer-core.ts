import yaml from "js-yaml";

export const HTTP_METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

export type OpenApiFormat = "openapi3" | "swagger2";

export type ParsedOpenApi = {
  doc: Record<string, unknown>;
  format: OpenApiFormat;
};

export function resolveJsonPointer(root: unknown, ref: string): unknown | null {
  if (!ref.startsWith("#/")) return null;
  const parts = ref.slice(2).split("/");
  let cur: unknown = root;
  for (const raw of parts) {
    if (cur === null || typeof cur !== "object") return null;
    const key = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (Array.isArray(cur)) {
      const idx = Number.parseInt(key, 10);
      if (Number.isNaN(idx)) return null;
      cur = cur[idx];
    } else {
      cur = (cur as Record<string, unknown>)[key];
    }
  }
  return cur ?? null;
}

export function parseOpenApiText(text: string):
  | { ok: true; data: ParsedOpenApi }
  | { ok: false; message: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, message: "Paste an OpenAPI document in YAML or JSON." };
  }
  let obj: unknown;
  try {
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      obj = JSON.parse(trimmed);
    } else {
      obj = yaml.load(trimmed);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: msg };
  }
  if (!obj || typeof obj !== "object") {
    return { ok: false, message: "Document must be a YAML mapping or JSON object." };
  }
  const o = obj as Record<string, unknown>;
  if (typeof o.openapi === "string" && o.openapi.startsWith("3")) {
    return { ok: true, data: { doc: o, format: "openapi3" } };
  }
  if (o.swagger === "2.0") {
    return { ok: true, data: { doc: o, format: "swagger2" } };
  }
  return {
    ok: false,
    message:
      'Expected OpenAPI 3.x (field "openapi": "3.x.x") or Swagger 2.0 (field "swagger": "2.0").',
  };
}

function resolvePathItem(
  root: Record<string, unknown>,
  pathItem: unknown,
): Record<string, unknown> | null {
  if (!pathItem || typeof pathItem !== "object") return null;
  const pi = pathItem as Record<string, unknown>;
  if (typeof pi.$ref === "string") {
    const resolved = resolveJsonPointer(root, pi.$ref);
    if (resolved && typeof resolved === "object") {
      return resolvePathItem(root, resolved);
    }
    return null;
  }
  return pi;
}

export type OperationEntry = {
  path: string;
  method: HttpMethod;
  operation: Record<string, unknown>;
};

export function listOperations(root: Record<string, unknown>): OperationEntry[] {
  const paths = root.paths;
  if (!paths || typeof paths !== "object") return [];
  const out: OperationEntry[] = [];
  for (const [path, rawItem] of Object.entries(paths as Record<string, unknown>)) {
    const pathItem = resolvePathItem(root, rawItem);
    if (!pathItem) continue;
    const pathLevelParams = Array.isArray(pathItem.parameters)
      ? (pathItem.parameters as unknown[])
      : [];
    for (const m of HTTP_METHODS) {
      const opRaw = pathItem[m];
      if (!opRaw || typeof opRaw !== "object") continue;
      const op = opRaw as Record<string, unknown>;
      const mergedParams = [
        ...pathLevelParams,
        ...(Array.isArray(op.parameters) ? op.parameters : []),
      ];
      out.push({
        path,
        method: m,
        operation: { ...op, parameters: mergedParams },
      });
    }
  }
  return out;
}

export function listSchemaNames(
  root: Record<string, unknown>,
  format: OpenApiFormat,
): string[] {
  if (format === "openapi3") {
    const comp = root.components;
    if (!comp || typeof comp !== "object") return [];
    const schemas = (comp as Record<string, unknown>).schemas;
    if (!schemas || typeof schemas !== "object") return [];
    return Object.keys(schemas as Record<string, unknown>).sort();
  }
  const defs = root.definitions;
  if (!defs || typeof defs !== "object") return [];
  return Object.keys(defs as Record<string, unknown>).sort();
}

export function getSchemaByName(
  root: Record<string, unknown>,
  format: OpenApiFormat,
  name: string,
): unknown {
  if (format === "openapi3") {
    const comp = root.components as Record<string, unknown> | undefined;
    const schemas = comp?.schemas as Record<string, unknown> | undefined;
    return schemas?.[name];
  }
  const defs = root.definitions as Record<string, unknown> | undefined;
  return defs?.[name];
}

export function safeStringify(value: unknown, maxLen = 120_000): string {
  try {
    const s = JSON.stringify(value, null, 2);
    if (s.length > maxLen) {
      return `${s.slice(0, maxLen)}\n… (truncated for display)`;
    }
    return s;
  } catch {
    return String(value);
  }
}

export const SAMPLE_OPENAPI_YAML = `openapi: 3.0.3
info:
  title: Sample Pet API
  version: 1.0.0
  description: Minimal OpenAPI 3 example for the viewer.
servers:
  - url: https://api.example.com/v1
paths:
  /pets:
    get:
      summary: List pets
      operationId: listPets
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            maximum: 100
            format: int32
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
    post:
      summary: Create a pet
      operationId: createPet
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
      responses:
        '201':
          description: Created
  /pets/{petId}:
    get:
      summary: Get pet by id
      operationId: getPet
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
        '404':
          description: Not found
components:
  schemas:
    Pet:
      type: object
      required:
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
      example:
        id: 1
        name: Whiskers
        tag: cat
`;
