import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurprise } from "@/lib/surprises";
import { SURPRISE_ID } from "@/lib/validation";
import Experience from "@/components/experience/Experience";
import Expired from "@/components/experience/Expired";

export const dynamic = "force-dynamic";

// Generic preview text: never put the recipient's name or message in link previews.
export const metadata: Metadata = {
  title: "A birthday surprise is waiting for you",
  description: "Someone made you a birthday surprise. Tap to open it.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "A birthday surprise is waiting for you",
    description: "Someone made you a birthday surprise. Tap to open it.",
    images: ["/opengraph-image"],
  },
};

export default async function SurprisePage({ params }: { params: { id: string } }) {
  if (!SURPRISE_ID.test(params.id)) notFound();
  const result = await getSurprise(params.id);
  if (result.status === "missing") notFound();
  if (result.status === "expired") return <Expired />;
  return <Experience surprise={result.surprise} />;
}
