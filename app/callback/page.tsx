"use client";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { Alert } from "react-bootstrap";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      const expirationTime = Date.now() + 3600 * 1000;

      localStorage.setItem("tokenExpired", expirationTime.toString());
      localStorage.setItem("accessToken", accessToken);

      const lastPage = localStorage.getItem("lastPage") || "/home-fan";
      router.push(lastPage);
    } else {
      console.error("Access token not found.");
      router.push(`/error`);
    }
  }, [router]);

  return (
    <div className="container d-flex flex-column justify-content-start align-items-center vh-100">
      <h1
        className="display-4 mt-2"
        onClick={() => router.push("/home-fan")}
        style={{ cursor: "pointer", textDecoration: "none" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ClubConnect
      </h1>
      <Alert variant="success" style={{ textAlign: "center" }}>
        Authenticating with your Google Calendar token...
      </Alert>
    </div>
  );
}
