import { getClubById } from "@/utils/api";
import ClubMatches from "./ClubMatches";
import { Club } from "@/interfaces/interfaces";
import ClubErrorPage from "@/app/error-page/page";

async function fetchClub(clubId: string): Promise<Club | null> {
  try {
    const club = await getClubById(clubId);
    return club ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateStaticParams() {
  const clubIds = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  return clubIds.map((club_id) => ({ club_id }));
}

export default async function Page({
  params,
}: {
  params: { club_id: string };
}) {
  const club = await fetchClub(params.club_id);

  if (!club) {
    return <ClubErrorPage />;
  }

  return <ClubMatches params={params} />;
}
