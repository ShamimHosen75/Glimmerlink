import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl text-lantern">This link doesn&apos;t lead anywhere</h1>
      <p className="mt-4 max-w-md text-lg text-cream/80">
        Check that the whole link was copied. Surprise links are long, and messaging apps sometimes cut them off.
      </p>
      <Link href="/" className="mt-8 rounded-full bg-lantern px-7 py-3 font-extrabold text-dusk">
        Go to the home page
      </Link>
    </main>
  );
}
