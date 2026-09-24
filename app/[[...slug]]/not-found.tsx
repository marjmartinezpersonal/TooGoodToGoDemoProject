import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-zinc-600">The page you requested doesn&apos;t exist or has moved.</p>
      <Link href="/" className="font-semibold underline">
        Return to the homepage
      </Link>
    </main>
  );
}
