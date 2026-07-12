import { getHomePageData } from "@/features/home/api/home.api";
import { Homepage } from "@/features/home/components/home-page";

export default async function Home() {
  const data = await getHomePageData();

  return <Homepage data={data} />;
}