import { readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

// Serves docs/images, so the tutorial's relative image paths work here and on GitHub.
export async function GET(_req: Request, ctx: RouteContext<"/docs/images/[file]">) {
  const file = path.basename((await ctx.params).file);
  const contentType = CONTENT_TYPES[path.extname(file).toLowerCase()];
  if (!contentType) return new Response(null, { status: 404 });

  try {
    const image = await readFile(path.join(process.cwd(), "docs/images", file));
    return new Response(image, { headers: { "Content-Type": contentType } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
