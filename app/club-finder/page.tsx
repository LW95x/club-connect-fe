"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { fetchAllClubs } from "@/utils/api";
import { Club } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";

export default function ClubFinder() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAllClubs().then((res) => {
      setClubs(res);
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
      <h3 className="display-12">Club Finder</h3>
      <ul className="list-unstyled d-flex flex-column align-items-center">
        {clubs.map((club) => (
          <li
            key={club.club_id}
            className="my-2 w-100"
            style={{ maxWidth: "600px" }}
          >
            <Button
              variant="light"
              className="w-100 p-3 border rounded shadow-sm"
              style={{ textAlign: "center" }}
              onClick={() =>
                (window.location.href = `/club-matches/${club.club_id}`)
              }
            >
              <div className="fw-bold">{club.club_name}</div>
              <div className="text-muted">
                <b>League:</b>
                {club.league}
              </div>
              <div className="text-muted">
                <b>Location:</b> {club.location}
              </div>
              <div className="text-muted">
                <b>Stadium Capacity:</b>
                {club.stadium_capacity}
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
