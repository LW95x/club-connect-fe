"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { getEventById, updateEvent } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Event } from "@/interfaces/interfaces";
import Lottie from "lottie-react";
import footballAnimation from "../../_lib/football.json";

export default function UpdateMatch({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const router = useRouter();
  const { id } = params;
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClubId = localStorage.getItem('club_id');
      setClubId(storedClubId);
    }
  }, []);


  useEffect(() => {
    getEventById(id)
      .then((res) => {
        setEvent(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError("This Match ID could not be found.")
        console.error(error);
      });
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess("");
    setIsError("");
    if (event && clubId) {
      updateEvent(
        clubId,
        id,
        event.available_tickets,
        event.title,
        event.location,
        parseInt(event.price ?? "0"),
        event.date_time,
        event.description,
      ).then((res) => {
        if (res.ok) {
          setIsLoading(false);
          setIsSuccess("Match details succesfully updated.");
          return res.json();
        } else if (!res.ok) {
          setIsError("A database error occurred while updating the match, please try again or reload the page.");
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
      setIsError(`Your Club ID could not be found, please log back in from the home page.`);
    }
  };

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
      <div className="text-center">
        {" "}
        <h1
          className="display-4"
          onClick={() => { router.push("/home-club"); setIsLoading(true); }}
          style={{ cursor: "pointer", textDecoration: "none" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          ClubConnect
        </h1>
        <h3 className="display-12">Update Match</h3>
      </div>

      <form
        className="w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group mb-3">
          <label htmlFor="matchtitle" className="form-label">
            Title
            <p style={{ fontSize: "12px" }}>(minimum length of 5 characters)</p>
          </label>
          <input
            type="text"
            id="matchtitle"
            className="form-control"
            minLength={5}
            value={event?.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="location" className="form-label">
            Location
            <p style={{ fontSize: "12px" }}>
              (minimum length of 10 characters)
            </p>
          </label>
          <input
            type="text"
            id="matchlocation"
            className="form-control"
            minLength={10}
            value={event?.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            id="price"
            className="form-control"
            min="1"
            value={event?.price}
            onChange={(e) => setEvent({ ...event, price: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="date" className="form-label">
            Date & Time
          </label>
          <input
            type="datetime-local"
            id="date"
            className="form-control"
            min={new Date().toISOString().slice(0, 16)} 
            value={event?.date_time?.split(".")[0]}
            onChange={(e) => setEvent({ ...event, date_time: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="description" className="form-label">
            Description
            <p style={{ fontSize: "12px" }}>
              (minimum length of 10 characters)
            </p>
          </label>
          <input
            type="text"
            id="description"
            className="form-control"
            minLength={10}
            value={event?.description}
            onChange={(e) =>
              setEvent({ ...event, description: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="tickets" className="form-label">
            Available Tickets
          </label>
          <input
            type="number"
            id="tickets"
            className="form-control"
            min="0"
            value={event?.available_tickets}
            onChange={(e) =>
              setEvent({
                ...event,
                available_tickets: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div className="d-flex justify-content-end mb-5">
          <button type="submit" className="btn btn-primary" style={{width: "200px"}}>
            Update Match
          </button>
        </div>
      </form>
      <div className="mt-2">
      {isSuccess != "" ? (
            <Alert className="bg-success text-center text-white rounded">
              {isSuccess}
            </Alert>
          ) : null}
      {isError != "" ? (
            <Alert className="bg-danger text-center text-white rounded">
              {isError}
            </Alert>
          ) : null}
      </div>
    </div>
  );
}