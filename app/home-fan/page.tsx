"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

export default function HomeFan() {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-4" onClick={() => router.push("/home-fan")}>
          ClubConnect
        </h1>
        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/club-finder")}
          >
            Club Finder
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/match-finder")}
          >
            Match Finder
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/fan-orders")}
          >
            My Tickets
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/fan-profile")}
          >
            My Profile
          </button>
          <button className="btn btn-outline-dark btn-lg" onClick={handleClick}>
            Logout Fan
          </button>
        </div>
      </div>
    </div>
  );
}
