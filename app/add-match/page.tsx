"use client";
import { useState, useEffect, FormEvent, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { Alert } from "react-bootstrap";
import { postNewEvent } from "@/utils/api";

export default function AddMatch() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState("");
  const [isError, setIsError] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [availableTickets, setAvailableTickets] = useState(0);
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedClubId = localStorage.getItem("club_id");
      setClubId(storedClubId);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess("");
    setIsError("");
    if (clubId) {
      postNewEvent(
        clubId,
        title,
        location,
        price,
        dateTime,
        description,
        availableTickets
      ).then((res) => {
        if (res.ok) {
          setIsSuccess("Match succesfully created.");
          formRef.current?.reset();
          setIsLoading(false);
          return res.json();
        } else if (res.ok === false) {
          setIsError("One of the fields failed validation.");
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-start align-items-center vh-100">
      <div className="text-center">
        {" "}
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
        <h3 className="display-12">Add New Match</h3>
      </div>
      <form
        ref={formRef}
        className="w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group mb-3">
          <label htmlFor="title" className="form-label">
            Match Title
            <p style={{ fontSize: "12px" }}>(minimum length of 5 characters)</p>
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            placeholder="Enter your match title"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="location" className="form-label">
            Match Location
            <p style={{ fontSize: "12px" }}>
              (minimum length of 10 characters)
            </p>
          </label>
          <input
            type="text"
            id="matchlocation"
            className="form-control"
            placeholder="Enter your match location"
            required
            onChange={(e) => setLocation(e.target.value)}
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
            placeholder="Enter your ticket price"
            required
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="date" className="form-label">
            Date & Time of Match
          </label>
          <input
            type="date"
            id="date"
            className="form-control"
            required
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="description" className="form-label">
            Match Description
            <p style={{ fontSize: "12px" }}>
              (minimum length of 10 characters)
            </p>
          </label>
          <input
            type="text"
            id="description"
            className="form-control"
            placeholder="Enter your match description"
            required
            onChange={(e) => setDescription(e.target.value)}
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
            placeholder="Enter the number of available tickets"
            required
            onChange={(e) => setAvailableTickets(parseInt(e.target.value))}
          />
        </div>
        <div className="d-flex justify-content-end mb-5">
          <button type="submit" className="btn btn-primary">
            Create Match
          </button>
        </div>
      </form>
      <div className="mt-2">
        {isSuccess && <span className="text-success">{isSuccess}</span>}
        {isError && <span className="text-danger">{isError}</span>}
      </div>
    </div>
  );
}
