import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

const IMAGES_DIR = path.join(process.cwd(), "docs/images");

// Prerenders every image at build time, so the CDN serves them as static files.
export async function generateStaticParams() {
  const files = await readdir(IMAGES_DIR);
  return files.filter((file) => path.extname(file).toLowerCase() in CONTENT_TYPES).map((file) => ({ file }));
}

// Any file not in docs/images at build time is a 404.
export const dynamicParams = false;

// Serves docs/images, so the tutorial's relative image paths work here and on GitHub.
export async function GET(_req: Request, ctx: RouteContext<"/docs/images/[file]">) {
  const file = path.basename((await ctx.params).file);
  const contentType = CONTENT_TYPES[path.extname(file).toLowerCase()];
  if (!contentType) return new Response(null, { status: 404 });

  try {
    const image = await readFile(path.join(IMAGES_DIR, file));
    return new Response(image, { headers: { "Content-Type": contentType } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
