import { fetchAllClubs } from "@/utils/api";
import ClubMatches from "./ClubMatches";

async function fetchClubIds(): Promise<string[]> {
  return fetchAllClubs()
    .then((clubs) => {
      return clubs.map((club) => club.club_id?.toString() ?? "");
    })
    .catch((error) => {
      console.error("Error fetching club IDs:", error);
      return [];
    });
}

export async function generateStaticParams() {
  const clubIds = await fetchClubIds();

  return clubIds.map((club_id) => ({
    club_id,
  }));
}

export default function Page({ params }: { params: { club_id: string } }) {
  return <ClubMatches params={params} />;
}
