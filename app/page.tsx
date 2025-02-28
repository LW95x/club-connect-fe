"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "./_lib/football.json";

export default function Entry() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="bg-dark opacity-75 p-4" style={{borderRadius: "12px"}}>
        <h1 className="display-4 text-white font-bold mt-2">ClubConnect</h1>
        <p className="lead mb-4 mt-4 text-white">
          Welcome to ClubConnect! An app designed to enable fans and clubs of
          Non-League Football to easily buy and sell tickets.
        </p>
        <div className="d-flex flex-column">
          <button
            className="btn btn-light btn-lg mt-3 opacity-75"
            onClick={() => {router.push("/login-fan"); setIsLoading(true);}}
          >
            Login Fan
          </button>
          <button
            className="btn btn-light btn-lg mt-3 opacity-75"
            onClick={() => {router.push("/login-club"); setIsLoading(true);}}
          >
            Login Club
          </button>
          <button
            className="btn btn-light btn-lg mt-3 opacity-75"
            onClick={() => {router.push("/register-fan"); setIsLoading(true);}}
          >
            Register as a Fan
          </button>
          <button
            className="btn btn-light btn-lg mt-3 opacity-75"
            onClick={() => {router.push("/register-club"); setIsLoading(true);}}
          >
            Register as a Club
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
