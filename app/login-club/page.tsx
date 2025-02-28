"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchAllClubs, postLoginClub } from "@/utils/api";
import { Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";

export default function LoginClub() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError("");
    postLoginClub(username, password).then((res) => {
      if (res.ok === true) {
        fetchAllClubs().then((clubs: any) => {
          const ClubDetails = clubs.filter((club: any) => {
            return club.username === username;
          });
          localStorage.setItem("club", username);
          localStorage.setItem("club_id", ClubDetails[0].club_id.toString());
          router.push("/home-club");
        });
      } else if (res.ok === false) {
        setIsError("Invalid username or password provided.");
        setIsLoading(false);
      }
    });
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Lottie
            animationData={footballAnimation}
            loop={true}
            style={{ width: 300, height: 300 }}
          />
          <p
            className="lead display-6 mb-1 mt-5 text-white font-bold"
            style={{ marginTop: "20px", marginLeft: "30px" }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="bg-dark text-white opacity-75 p-4 text-center" style={{borderRadius: "12px"}}>
        <h1
          className="display-4"
          onClick={() => {
            router.push("/");
            setIsLoading(true);
          }}
          style={{ cursor: "pointer", textDecoration: "none" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          ClubConnect
        </h1>
        <h3 className="display-12">Login (Club)</h3>
      </div>
      <form
        className="w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group mb-3 mt-3 text-white bg-dark opacity-75 p-4" style={{borderRadius: "12px"}}>
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter your username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group mb-3 mt-3 text-white bg-dark opacity-75 p-4" style={{borderRadius: "12px"}}>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-between mb-5">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.push("/")}
          >
            Go Back
          </button>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      {isError != "" ? (
        <Alert className="bg-danger text-center text-white rounded">
          {isError}
        </Alert>
      ) : null}
    </div>
  );
}
