"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { fetchAllClubEvents, fetchFanOrders } from "@/utils/api";
import { Event } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";

export default function ClubMatches() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const router = useRouter();
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClubId = localStorage.getItem('club_id');
      setClubId(storedClubId);
    }
  }, []);

  useEffect(() => {
    if (clubId) {
      fetchAllClubEvents(clubId)
        .then((res) => {
          if (res.length > 0) {
            setEvents(res);
          } else {
            setIsError("No orders found for this Club ID.");
          }
        })
        .catch((error) => {
          console.error(error);
          setIsError("Failed to fetch orders for this Club ID.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsError("Club ID is missing.");
      setIsLoading(false);
    }
  }, [clubId]);

  if (isLoading) {
    return (
      <>
        <Alert variant="secondary" style={{ textAlign: "center" }}>
          Loading...
        </Alert>
      </>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-start align-items-center vh-100">
      <h1
        className="display-4"
        onClick={() => router.push("/home-club")}
        style={{ cursor: "pointer", textDecoration: "none" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ClubConnect
      </h1>
      <h3 className="display-12">My Matches</h3>
      <ul className="list-unstyled d-flex flex-column align-items-center">
        {events.length > 0 ? (
          events.map((event) => (
            <li
              key={event.event_id}
              className="my-2 w-100"
              style={{ maxWidth: "600px" }}
            >
              <Button
                variant="light"
                className="w-100 p-3 border rounded shadow-sm"
                style={{ textAlign: "center" }}
                onClick={() => router.push(`/update-match/${event.event_id}`)}
              >
                <div className="fw-bold mb-2">{event.title}</div>
                <div className="text-muted mb-2">{event.description}</div>
                <div className="text-muted mb-2">Price - £{event.price}</div>
                <div className="text-muted mb-2">
                  Location - {event.location}
                </div>
                <div className="text-muted mb-2">
                  Date - {event.date_time?.split("T")[0]}
                </div>
                <div className="text-muted mb-2">
                  Time - {event.date_time?.split("T")[1].slice(0,5)}
                </div>
                <div className="text-muted mb-2">
                  Available Tickets - {event.available_tickets}
                </div>
              </Button>
            </li>
          ))
        ) : (
          <p>Loading club matches...</p>
        )}
      </ul>
    </div>
  );
}
