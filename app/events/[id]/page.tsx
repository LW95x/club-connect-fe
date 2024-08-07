import { fetchAllEvents } from "@/utils/api";
import SingleMatch from "./SingleMatch";

async function fetchEventIds(): Promise<string[]> {
  return fetchAllEvents()
    .then((events) => {
      return events.map((event) => event.event_id?.toString() ?? "");
    })
    .catch((error) => {
      console.error("Error fetching event IDs:", error);
      return [];
    });
}

export async function generateStaticParams() {
  const eventIds = await fetchEventIds();

  return eventIds.map((id) => ({
    id,
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <SingleMatch params={params} />;
}
