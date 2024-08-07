"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { postNewClub } from "@/utils/api";
import { Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function RegisterClub() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [clubName, setClubName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [league, setLeague] = useState("");
  const [stadiumCapacity, setStadiumCapacity] = useState(0);
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    postNewClub(
      username,
      password,
      clubName,
      league,
      location,
      stadiumCapacity,
      email,
      phoneNumber,
      website,
      facebook,
      twitter,
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.ok === false) {
          setIsSuccess("One of the fields failed validation.");
          setIsLoading(false);
        }
      })
      .then((data) => {
        localStorage.setItem("club", username);
        localStorage.setItem("club_id", data.club_id.toString());
        router.push("/home-club");
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
    <div className="container d-flex flex-column justify-content-start align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-4">ClubConnect</h1>
        <h3 className="display-12">Register (Club)</h3>
      </div>
      <p style={{ color: "red" }}>{isSuccess}</p>
      <form
        className="w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group mb-3">
          <label htmlFor="username" className="form-label">
            Username{" "}
            <p style={{ fontSize: "12px" }}>(minimum length of 5 characters)</p>
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
            <p style={{ fontSize: "12px" }}>
              (Password must contain one digit from 1 to 9, one lowercase
              letter, one uppercase letter, one special character, no space, and
              it must be 8-16 characters long)
            </p>
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            pattern="^(?=.*\d)(?=.*[A-Z]).{8,16}$"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email address"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="clubname" className="form-label">
            Club Name{" "}
            <p style={{ fontSize: "12px" }}>(minimum length of 5 characters)</p>
          </label>
          <input
            type="text"
            id="clubname"
            className="form-control"
            placeholder="Enter your club name"
            required
            onChange={(e) => setClubName(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="league" className="form-label">
            League{" "}
            <p style={{ fontSize: "12px" }}>(minimum length of 5 characters)</p>
          </label>
          <input
            type="text"
            id="league"
            className="form-control"
            placeholder="Enter your league"
            required
            onChange={(e) => setLeague(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="address" className="form-label">
            Club Address{" "}
            <p style={{ fontSize: "12px" }}>
              (minimum length of 10 characters)
            </p>
          </label>
          <input
            type="text"
            id="address"
            className="form-control"
            placeholder="Enter your address"
            required
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="phonenumber" className="form-label">
            Phone Number{" "}
            <p style={{ fontSize: "12px" }}>
              (minimum length of 10 characters)
            </p>
          </label>
          <input
            type="text"
            id="phonenumber"
            className="form-control"
            placeholder="Enter your phone number"
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="capacity" className="form-label">
            Stadium Capacity
          </label>
          <input
            type="number"
            id="capacity"
            className="form-control"
            min="1"
            placeholder="Enter your stadium capacity"
            required
            onChange={(e) => setStadiumCapacity(parseInt(e.target.value))}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="website" className="form-label">
            Club Website <p style={{ fontSize: "12px" }}>(optional)</p>
          </label>
          <input
            type="url"
            id="website"
            className="form-control"
            placeholder="Enter your club's website"
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="facebook" className="form-label">
            Club Facebook <p style={{ fontSize: "12px" }}>(optional)</p>
          </label>
          <input
            type="url"
            id="facebook"
            className="form-control"
            placeholder="Enter your club's facebook"
            onChange={(e) => setFacebook(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="twitter" className="form-label">
            Club Twitter <p style={{ fontSize: "12px" }}>(optional)</p>
          </label>
          <input
            type="url"
            id="twitter"
            className="form-control"
            placeholder="Enter your club's twitter"
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-between mb-5">
          <button className="btn btn-primary" onClick={() => router.push("/")}>
            Go Back
          </button>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
