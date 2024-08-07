"use client";
import { useState, useEffect, FormEvent, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { Alert } from "react-bootstrap";

export default function Error() {
  const router = useRouter();

  return (
    <div className="container d-flex flex-column justify-content-start align-items-center vh-100">
      <h1
        className="display-4"
        onClick={() => router.push("/home-fan")}
        style={{ cursor: "pointer", textDecoration: "none" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ClubConnect
      </h1>
      <Alert variant="danger" style={{ textAlign: "center" }}>
        There was an error acessing your Google Authentication Code.
      </Alert>
    </div>
  );
}
