"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";

export default function HomeClub() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.clear();
    router.push("/");
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
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-4">ClubConnect</h1>
        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => {router.push("/club-matches"); setIsLoading(true);}}
          >
            My Matches
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => { router.push("/add-match"); setIsLoading(true);}}
          >
            Add New Match
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => { router.push("/club-profile"); setIsLoading(true);}}
          >
            My Profile
          </button>
          <button className="btn btn-outline-dark btn-lg" onClick={() => {{handleClick}; setIsLoading(true); }}>
            Logout Club
          </button>
        </div>
      </div>
    </div>
  );
}
