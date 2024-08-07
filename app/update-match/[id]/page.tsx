import { fetchAllEvents } from "@/utils/api";
import UpdateMatch from "./UpdateMatch";

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
  return <UpdateMatch params={params} />;
}
