import Link from "next/link";
import { BRAND } from "@/lib/config";

export default function Expired() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl text-lantern">This surprise has ended</h1>
      <p className="mt-4 max-w-md text-lg text-cream/80">
        Links last {BRAND.linkLifetimeHours} hours, then everything in them is deleted. Ask the sender for a new one, or
        make your own.
      </p>
      <Link href="/create" className="mt-8 rounded-full bg-lantern px-7 py-3 font-extrabold text-dusk">
        Make a surprise
      </Link>
    </main>
  );
}
