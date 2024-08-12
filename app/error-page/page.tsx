"use client";
import { useState, useEffect, FormEvent, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { Alert } from "react-bootstrap";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";

export default function ClubErrorPage() {
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
    <div className="container d-flex flex-column justify-content-start align-items-center vh-100">
      <h1
        className="display-4"
        onClick={() => { router.back(); setIsLoading(true); }}
        style={{ cursor: "pointer", textDecoration: "none" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ClubConnect
      </h1>
      <Alert variant="danger" style={{ textAlign: "center" }}>
      404 - This item could not be found.
      </Alert>
    </div>
  );
}
