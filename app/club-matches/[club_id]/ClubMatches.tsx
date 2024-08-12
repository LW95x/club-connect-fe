"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { fetchAllClubEvents, getClubById } from "@/utils/api";
import { Event, Club } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../../_lib/football.json";

export default function ClubMatches({
  params,
}: {
  params: { club_id: string };
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [club, setClub] = useState<Club>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const club_id = params.club_id;
  const router = useRouter();

  useEffect(() => {
    const fetchEventsAndClub = async () => {
      try {
        const [eventsData, clubData] = await Promise.all([
          fetchAllClubEvents(club_id),
          getClubById(club_id),
        ]);

        setEvents(eventsData);
        setClub(clubData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsAndClub();
  }, [club_id]);

  if (isLoading) {
    return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Lottie animationData={footballAnimation} loop={true} style={{ width: 300, height: 300 }}/>
    </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger" style={{ textAlign: "center" }}>
        Failed to load club information. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-start align-items-center vh-100">
      <h1
        className="display-4"
        onClick={() => { router.push("/home-fan"); setIsLoading(true);}}
        style={{ cursor: "pointer", textDecoration: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ClubConnect
      </h1>
      <h3 className="display-12">{club?.club_name} Matches</h3>
      <ul className="list-unstyled d-flex flex-column align-items-center">
        {events.map((event) => (
          <li
            key={event.event_id}
            className="my-2 w-100"
            style={{ maxWidth: "600px" }}
          >
            <Button
              variant="light"
              className="w-100 p-3 border rounded shadow-sm"
              style={{ textAlign: "center" }}
              onClick={() => { router.push(`/events/${event.event_id}`); setIsLoading(true); }   
            }
            >
              <div className="fw-bold mb-2">{event.title}</div>
              <div className="text-muted mb-2">{event.description}</div>
              <div className="text-muted mb-2">Price - £{event.price}</div>
              <div className="text-muted mb-2">Location - {event.location}</div>
              <div className="text-muted mb-2">
                Date - {event.date_time?.split("T")[0]} @ {event.date_time?.split("T")[1].slice(0,5)}
              </div>
              <div className="text-muted mb-2">
                Available Tickets - {event.available_tickets}
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
