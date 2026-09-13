import type { Context } from "hono";

export function notFound(c: Context) {
  return c.json({ error: { message: "Not found", status: 404 } as const }, 404);
}

export function onError(err: Error, c: Context) {
  console.error(err);
  return c.json(
    { error: { message: "Internal server error", status: 500 } as const },
    500,
  );
}
