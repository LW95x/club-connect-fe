"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";

export default function HomeFan() {
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
        <Lottie animationData={footballAnimation} loop={true} style={{ width: 300, height: 300 }}/>
    </div>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-4" onClick={() => {router.push("/home-fan"); setIsLoading(true);}}>
          ClubConnect
        </h1>
        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => { router.push("/club-finder"); setIsLoading(true);}}
          >
            Club Finder
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => { router.push("/match-finder"); setIsLoading(true)}}
          >
            Match Finder
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => { router.push("/fan-orders"); setIsLoading(true);}}
          >
            My Tickets
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => { router.push("/fan-profile"); setIsLoading(true);}}
          >
            My Profile
          </button>
          <button className="btn btn-outline-dark btn-lg" onClick={() => {{handleClick}; setIsLoading(true); }}>
            Logout Fan
          </button>
        </div>
      </div>
    </div>
  );
}
