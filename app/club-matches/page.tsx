"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { fetchAllClubEvents } from "@/utils/api";
import { Event } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";
import ClubNavBar from "../_lib/ClubNavBar";

export default function ClubMatches() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const router = useRouter();
  const [clubId, setClubId] = useState<string | null>(null);
  const [isClubIdLoaded, setIsClubIdLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedClubId = localStorage.getItem("club_id");
      setClubId(storedClubId);
      setIsClubIdLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isClubIdLoaded) return;

    if (clubId) {
      setIsLoading(true);
      fetchAllClubEvents(clubId)
        .then((res) => {
          if (res.length > 0) {
            setEvents(res);
          } else {
            setIsLoading(false);
            setIsError("No orders found for this Club ID.");
          }
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          setIsError("No orders found for this Club ID.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setIsError(
        `Your Club ID could not be found, please log back in from the home page.`
      );
    }
  }, [clubId, isClubIdLoaded]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Lottie
            animationData={footballAnimation}
            loop={true}
            style={{ width: 300, height: 300 }}
          />
          <p
            className="lead display-6 mb-1 mt-5 text-white font-bold"
            style={{ marginTop: "20px", marginLeft: "30px" }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex flex-column justify-content-start vh-100 vw-100 p-0">
      <h1
        className="display-4 text-white mt-2 text-center"
        onClick={() => {
          router.push("/home-club");
          setIsLoading(true);
        }}
        style={{ cursor: "pointer", textDecoration: "none" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ClubConnect
      </h1>
      <ClubNavBar />
      <div className="d-flex justify-content-center mt-2">
        <div
          className="bg-dark text-white p-2 rounded-xl opacity-75"
          style={{ borderRadius: "12px", height: "50px" }}
        >
          <h3 className="display-12 text-white text-center m-0">My Matches</h3>
        </div>
      </div>

      {isError != "" ? (
        <Alert className="bg-danger text-center text-white rounded">
          {isError}
        </Alert>
      ) : null}
      <ul className="list-unstyled d-flex flex-column align-items-center">
        {events.map((event) => (
          <li
            key={event.event_id}
            className="my-2 w-100"
            style={{ maxWidth: "600px" }}
          >
            <Button
              variant="dark"
              className="w-100 p-3 border rounded shadow-sm text-start border-dark opacity-75"
              onClick={() => {
                router.push(`/update-match/${event.event_id}`);
                setIsLoading(true);
              }}
            >
              <h5 className="fw-bold mb-3 text-center">{event.title}</h5>
              <div className="mb-3 text-center">{event.description}</div>
              <hr />
              <div className="mb-2">
                <b>Price:</b> £{event.price}
              </div>
              <div className="mb-2">
                <b>Location:</b> {event.location}
              </div>
              <div className="mb-2">
                <b>Date:</b> {event.date_time?.split("T")[0]}
              </div>
              <div className="mb-2">
                <b>Time:</b> {event.date_time?.split("T")[1].slice(0, 5)}
              </div>
              <div className="mb-2">
                <b>Available Tickets:</b> {event.available_tickets}
              </div>
              <hr />
              <div className="mb-2 text-end">
                <b>Update Match -&gt;</b>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
