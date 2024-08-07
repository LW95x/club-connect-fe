"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchAllClubs, postLoginClub } from "@/utils/api";
import { Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function LoginClub() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    postLoginClub(username, password).then((res) => {
      if (res.ok === true) {
        fetchAllClubs().then((res: any) => {
          const ClubDetails = res.clubs.filter((club: any) => {
            return club.username === username;
          });
          localStorage.setItem("club", username);
          localStorage.setItem("club_id", ClubDetails[0].club_id.toString());
          router.push("/home-club");
        });
      } else if (res.ok === false) {
        setIsSuccess("Invalid username or password.");
        setIsLoading(false);
      }
    });
  };

  if (isLoading) {
    return (
      <>
        <Alert variant="secondary" style={{ textAlign: "center" }}>
          Loading...
        </Alert>
      </>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-4">ClubConnect</h1>
        <h3 className="display-12">Login (Club)</h3>
      </div>
      <p style={{ color: "red" }}>{isSuccess}</p>
      <form
        className="w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group mb-3">
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
        <div className="form-group mb-3">
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
          <button className="btn btn-primary" onClick={() => router.push("/")}>
            Go Back
          </button>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
