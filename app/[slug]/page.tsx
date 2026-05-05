import { notFound } from "next/navigation";
import { PublicSite } from "@/components/PublicSite";
import { getPublicData } from "@/lib/data";
import { pickLang } from "@/lib/translations";

const slugs = [
  "rreth-shoqates",
  "projekte",
  "raportet-financiare",
  "anetaret",
  "behu-anetar",
  "donacione",
  "kryesia",
  "eventet",
  "galeria",
  "statuti",
  "kontakt"
];

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();
  const query = (await searchParams) ?? {};
  const data = await getPublicData();
  return <PublicSite data={data} lang={pickLang(query.lang)} page={slug} saved={query.saved === "1"} />;
}
