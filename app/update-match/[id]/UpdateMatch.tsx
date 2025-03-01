"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "react-bootstrap";
import { getEventById, updateEvent } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Event } from "@/interfaces/interfaces";
import Lottie from "lottie-react";
import footballAnimation from "../../_lib/football.json";
import ClubNavBar from "@/app/_lib/ClubNavBar";

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
          <p className="lead display-6 mb-1 mt-5 text-white font-bold" style={{marginTop: "20px", marginLeft: "30px"}}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex flex-column justify-content-start align-items-center vh-100 vw-100 p-0">
        <h1
          className="display-4 text-white mt-2"
          onClick={() => { router.push("/home-club"); setIsLoading(true); }}
          style={{ cursor: "pointer", textDecoration: "none" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          ClubConnect
        </h1>
        <ClubNavBar />
        <div
        className="bg-dark text-white p-2 rounded-xl mt-2 opacity-75 flex items-center justify-center"
        style={{ borderRadius: "12px", height: "50px"}}
      >
        <h3 className="display-12">Update Match</h3>
        </div>
        <div className="mt-4 opacity-75">
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
      <form
        className="w-50"
        onSubmit={handleSubmit}
      >
        <div className="form-group mb-3 text-white bg-dark opacity-75 p-4" style={{borderRadius: "12px"}}>
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
        <div className="form-group mb-3 mt-3 text-white bg-dark opacity-75 p-4" style={{borderRadius: "12px"}}>
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
        <div className="form-group mb-3 mt-3 text-white bg-dark opacity-75 p-4" style={{borderRadius: "12px"}}>
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
        <div className="form-group mb-3 mt-3 text-white bg-dark opacity-75 p-4" style={{borderRadius: "12px"}}>
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
        <div className="form-group mb-3 mt-3 text-white bg-dark opacity-75 p-4" style={{borderRadius: "12px"}}>
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
        <div className="form-group mb-3 mt-3 text-white bg-dark opacity-75 p-4" style={{borderRadius: "12px"}}>
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
        <div className="d-flex justify-content-center mb-5">
          <button type="submit" className="btn btn-primary" style={{width: "300px"}}>
            Update Match
          </button>
        </div>
      </form>
    </div>
  );
}