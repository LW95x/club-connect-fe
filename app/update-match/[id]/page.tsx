import { getEventById } from "@/utils/api";
import UpdateMatch from "./UpdateMatch";
import { Event } from "@/interfaces/interfaces";
import ClubErrorPage from "@/app/error-page/page";

export async function generateStaticParams() {
  const eventIds = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  return eventIds.map((id) => ({ id }));
}

async function fetchEvent(eventId: string): Promise<Event | null> {
  try {
    const event = await getEventById(eventId);
    return event ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const event = await fetchEvent(params.id);

  if (!event) {
    return <ClubErrorPage />;
  }

  return <UpdateMatch params={params} />;
}
