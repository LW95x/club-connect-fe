"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { getEventById, postNewOrder, updateEvent } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Event } from "@/interfaces/interfaces";

export default function SingleMatch({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState("");
  const [isError, setIsError] = useState("");
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { id } = params;
  const [fanId, setFanId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpirationTime, setTokenExpirationTime] = useState<string | null>(
    null
  );
  const isTokenExpired =
    !tokenExpirationTime || Date.now() >= Number(tokenExpirationTime);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedClubId = localStorage.getItem("fan_id");
      const storedToken = localStorage.getItem("accessToken");
      const storedTokenExpirationTime = localStorage.getItem("tokenExpired");
      setFanId(storedClubId);
      setToken(storedToken);
      setTokenExpirationTime(storedTokenExpirationTime);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getEventById(id)
        .then((res) => {
          setEvent(res);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Alert variant="secondary" style={{ textAlign: "center" }}>
          Loading...
        </Alert>
      </>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess("");
    setIsError("");

    if (addToCalendar && (!token || isTokenExpired)) {
      handleAddToCalendar();
      return;
    }
    if (fanId) {
      postNewOrder(
        fanId,
        id,
        new Date(Date.now()).toISOString(),
        quantity,
        parseInt(event?.price ?? "0") * quantity,
        "Pending",
        addToCalendar,
        token || ''
      ).then((res) => {
        if (res.ok && event) {
          updateEvent(
            event.home_club_id?.toString() ?? "",
            id,
            event.available_tickets ?? 0 - quantity
          );
          setIsSuccess("Order succesfully created.");
          setIsLoading(false);
          return res.json();
        } else if (res.ok === false) {
          setIsError("Order failed, please try again.");
          setIsLoading(false);
        }
      });
    }
  };

  const handleAddToCalendar = () => {
    const clientId =
      "610240236325-tvtkgptkdqdsfoli9ra2eahiscs23pl8.apps.googleusercontent.com";
    const redirectUri = "https://clubconnects.netlify.app/callback";
    const scope = "https://www.googleapis.com/auth/calendar.events";

    localStorage.setItem("lastPage", window.location.pathname);

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&include_granted_scopes=true`;
  };

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
      <h3 className="display-12">Order Tickets</h3>
      <ul className="list-unstyled d-flex flex-column align-items-center">
        <li
          key={event?.event_id}
          className="my-2 w-100"
          style={{ maxWidth: "600px" }}
        >
          <Button
            variant="light"
            className="w-100 p-3 border rounded shadow-sm"
            style={{ textAlign: "center" }}
          >
            <div className="fw-bold mb-2">{event?.title}</div>
            <div className="text-muted mb-2">Location - {event?.location}</div>
            <div className="text-muted mb-2">
              Ticket Price - £{event?.price}
            </div>
            <div className="text-muted mb-2">
              Date & Time - {event?.date_time?.split("T")[0]} @{" "}
              {event?.date_time?.split("T")[1].slice(0, 5)}
            </div>
            <div className="text-muted mb-2">
              Description - {event?.description}
            </div>
            <div className="text-muted mb-2">
              Available Tickets: {event?.available_tickets}
            </div>
          </Button>
        </li>
      </ul>

      <form
        onSubmit={handleSubmit}
        className="w-50"
        style={{ maxWidth: "400px" }}
      >
        <div className="d-flex justify-content-center align-items-center">
          <input
            type="number"
            style={{ width: "80px" }}
            className="form-control me-2"
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
            max="10"
            value={quantity}
            required
          />
          <button type="submit" className="btn btn-primary">
            Order Now
          </button>
        </div>
        <div className="mt-3 p-2 rounded bg-dark text-light text-center">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input"
              checked={addToCalendar}
              onChange={(e) => setAddToCalendar(e.target.checked)}
            />{" "}
            Add to Google Calendar?
          </label>
        </div>
        <div className="mt-3 mb-2 bg-success">
          {isSuccess && <span className="text-success">{isSuccess}</span>}
          {isError && <span className="text-danger">{isError}</span>}
        </div>
        <div className="mt-3 p-2 rounded bg-dark text-light text-center">
        Total Price: £{quantity * (parseInt(event?.price ?? "0") || 0)}.00
        </div>
      </form>
    </div>
  );
}
