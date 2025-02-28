"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { fetchAllClubs } from "@/utils/api";
import { Club } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";
import FanNavBar from "../_lib/FanNavBar";

export default function ClubFinder() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchAllClubs()
      .then((res) => {
        setClubs(res);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setIsError(
          "A database error occurred while fetching the clubs, please try again or reload the page."
        );
      });
  }, []);

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
    <div className="container-fluid d-flex flex-column justify-content-start align-items-center vh-100 vw-100 p-0">
      <h1
        className="display-4 text-white mt-2"
        onClick={() => {
          router.push("/home-fan");
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
      <FanNavBar />
      <div
        className="bg-dark text-white p-2 rounded-xl mt-2 opacity-75 flex items-center justify-center"
        style={{ borderRadius: "12px", height: "50px"}}
      >
        <h3 className="display-12 text-white text-center">Club Finder</h3>
      </div>
      {isError != "" ? (
        <Alert className="bg-danger text-center text-white rounded">
          {isError}
        </Alert>
      ) : null}
      <ul className="list-unstyled d-flex flex-column align-items-center">
        {clubs.map((club) => (
          <li
            key={club.club_id}
            className="my-2 w-100"
            style={{ maxWidth: "600px" }}
          >
            <Button
              variant="dark"
              className="w-100 p-3 border rounded shadow-sm text-start border-dark opacity-75"
              onClick={() => {
                router.push(`/club-matches/${club.club_id}`);
                setIsLoading(true);
              }}
            >
              <h5 className="fw-bold mb-3 text-center">{club.club_name}</h5>
              <hr />
              <div className="text-white mb-1">
                <b>League:</b> {club.league}
              </div>
              <div className="text-white mb-1">
                <b>Location:</b> {club.location}
              </div>
              <div className="text-white mb-1">
                <b>Stadium Capacity:</b> {club.stadium_capacity}
              </div>
              <hr />
              <div className="text-white mt-4 text-end">
                <b>View Club Matches -&gt;</b>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
