"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

export default function Entry() {
  const router = useRouter();
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
            onClick={() => router.push("/login-fan")}
          >
            Login Fan
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/login-club")}
          >
            Login Club
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/register-fan")}
          >
            Register as a Fan
          </button>
          <button
            className="btn btn-outline-dark btn-lg"
            onClick={() => router.push("/register-club")}
          >
            Register as a Club
          </button>
        </div>
      </div>
    </div>
  );
}
