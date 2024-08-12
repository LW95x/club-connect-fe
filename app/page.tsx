"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { Alert } from "react-bootstrap";
import Lottie from "lottie-react";
import footballAnimation from "./_lib/football.json";

export default function Entry() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        <h1 className="display-4">ClubConnect</h1>
        <p className="lead mb-4">
          Welcome to ClubConnect! An app designed to enable fans and clubs of
          Non-League Football to easily buy and sell tickets.
        </p>
        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => {router.push("/login-fan"); setIsLoading(true);}}
          >
            Login Fan
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => {router.push("/login-club"); setIsLoading(true);}}
          >
            Login Club
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => {router.push("/register-fan"); setIsLoading(true);}}
          >
            Register as a Fan
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => {router.push("/register-club"); setIsLoading(true);}}
          >
            Register as a Club
          </button>
        </div>
      </div>
    </div>
  );
}
