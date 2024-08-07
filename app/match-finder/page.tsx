"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { fetchAllEvents } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Event } from "@/interfaces/interfaces";

export default function MatchFinder() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAllEvents().then((res) => {
      setEvents(res);
      setIsLoading(false);
    });
  }, []);

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
        onClick={() => router.push("/home-fan")}
        style={{ cursor: "pointer", textDecoration: "none" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ClubConnect
      </h1>
      <h3 className="display-12">Match Finder</h3>
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
              onClick={() =>
                (window.location.href = `/events/${event.event_id}`)
              }
            >
              <div className="fw-bold">{event.title}</div>
              <div className="text-muted">{event.description}</div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
