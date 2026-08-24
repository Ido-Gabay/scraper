import { notFound } from "next/navigation";
import pagesData from "@/data/pages_data.json";
import DynamicNicheRenderer from "@/components/DynamicNicheRenderer";

type PageData = (typeof pagesData)[number];
type Props = { params: Promise<{ slug: string }> };

export default async function LeadPage({ params }: Props) {
  const { slug } = await params;
  const lead = (pagesData as PageData[]).find((p) => p.slug === slug);
  if (!lead) notFound();
  return <DynamicNicheRenderer lead={lead} />;
}

export function generateStaticParams() {
  return (pagesData as PageData[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lead = (pagesData as PageData[]).find((p) => p.slug === slug);
  return {
    title: lead?.businessName ?? "עסקים מובילים",
    description: lead?.tagline ?? "",
  };
}
