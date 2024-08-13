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
  const [isError, setIsError] = useState("");
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
        console.error(error);
        setIsLoading(false);
        setIsError("A database error occurred while fetching this clubs matches, please try again or reload the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsAndClub();
  }, [club_id]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Lottie animationData={footballAnimation} loop={true} style={{ width: 300, height: 300 }} />
          <p className="lead display-6 mb-1 mt-5" style={{marginTop: "20px", marginLeft: "30px"}}>Loading...</p>
        </div>
      </div>
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
      {isError != "" ? (
            <Alert className="bg-danger text-center text-white rounded">
              {isError}
            </Alert>
          ) : null}
      <ul className="list-unstyled d-flex flex-column">
        {events.map((event) => (
          <li
            key={event.event_id}
            className="my-2 w-100"
            style={{ maxWidth: "600px" }}
          >
            <Button
              variant="light"
              className="w-100 p-3 border rounded shadow-sm text-start"
              onClick={() => { router.push(`/events/${event.event_id}`); setIsLoading(true); }   
            }
            >
              <h5 className="fw-bold mb-3 text-center">{event.title}</h5>
              <div className="text-muted mb-3 text-center">{event.description}</div>
              <hr/>
              <div className="text-muted mb-2"><b>Price:</b> £{event.price}</div>
              <div className="text-muted mb-2"><b>Location:</b> {event.location}</div>
              <div className="text-muted mb-2">
                <b>Date:</b> {event.date_time?.split("T")[0]} @ {event.date_time?.split("T")[1].slice(0,5)}
              </div>
              <div className="text-muted mb-2">
                <b>Available Tickets:</b> {event.available_tickets}
              </div>
              <hr/>
              <div className="text-muted mb-2 text-end">
                <b>Order Tickets -&gt;</b>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
