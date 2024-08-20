"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";
import FanNavBar from "../_lib/FanNavBar";

export default function HomeFan() {
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
      } else if (!storedFanId && storedClubId) {
        router.push("/home-club");
      } else if (storedFanId) {
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Lottie animationData={footballAnimation} loop={true} style={{ width: 300, height: 300 }} />
          <p className="lead display-6 mb-1 mt-5" style={{marginTop: "20px", marginLeft: "30px"}}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex flex-column justify-content-start align-items-center vh-100 vw-100 p-0">
        <h1 className="display-4 mb-2">
          ClubConnect
        </h1>
        <FanNavBar />
        <div className="d-flex flex-column gap-3 w-50 mt-5">
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
        <div className="container-fluid mt-5 p-0">
    <img src="/nlfootball.jpg" alt="Non-League Football" className="img-fluid w-100 rounded" style={{
      height: '350px', 
      objectFit: 'cover', 
      width: '100%',
      position: 'fixed',
      bottom: '0' 
    }}/>
  </div>
      </div>
  );
}
