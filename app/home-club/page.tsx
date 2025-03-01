"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";
import ClubNavBar from "../_lib/ClubNavBar";

export default function HomeClub() {
  const [isLoading, setIsLoading] = useState(false);
  const [clubId, setClubId] = useState<string | null>(null);
  const [fanId, setFanId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedClubId = localStorage.getItem("club_id");
      const storedFanId = localStorage.getItem("fan_id");

      if (!storedClubId && !storedFanId) {
        router.push("/");
      } else if (!storedClubId && storedFanId) {
        router.push("/home-fan");
      } else if (storedClubId) {
        setClubId(storedClubId);
        setFanId(storedFanId);
      }
    }
  }, [router]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.clear();
    router.push("/");
  };

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
      <h1 className="display-4 mb-4 text-white mt-2">ClubConnect</h1>
      <ClubNavBar />
      <div className="d-flex flex-column gap-3 w-50 mt-5">
        <button
          className="btn btn-dark btn-lg mb-2 mt-5 opacity-75"
          onClick={() => {
            router.push("/add-match");
            setIsLoading(true);
          }}
        >
          Add New Match
        </button>
        <button
          className="btn btn-dark btn-lg mb-2 opacity-75"
          onClick={() => {
            router.push("/club-matches");
            setIsLoading(true);
          }}
        >
          My Matches
        </button>
        <button
          className="btn btn-dark btn-lg mb-2 opacity-75"
          onClick={() => {
            router.push("/club-profile");
            setIsLoading(true);
          }}
        >
          My Profile
        </button>
        <button
          className="btn btn-dark btn-lg mb-2 opacity-75"
          onClick={handleClick}
        >
          Logout Club
        </button>
      </div>
    </div>
  );
}
