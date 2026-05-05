import { PublicSite } from "@/components/PublicSite";
import { getPublicData } from "@/lib/data";
import { pickLang } from "@/lib/translations";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const data = await getPublicData();
  return <PublicSite data={data} lang={pickLang(params.lang)} page="home" />;
}
