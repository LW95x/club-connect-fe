"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

export default function HomeClub() {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-4">ClubConnect</h1>
        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/club-matches")}
          >
            My Matches
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/add-match")}
          >
            Add New Match
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/club-profile")}
          >
            My Profile
          </button>
          <button className="btn btn-outline-dark btn-lg" onClick={handleClick}>
            Logout Club
          </button>
        </div>
      </div>
    </div>
  );
}
