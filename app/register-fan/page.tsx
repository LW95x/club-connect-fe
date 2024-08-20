"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { postNewFan } from "@/utils/api";
import { Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";

export default function RegisterFan() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    postNewFan(username, password, dateOfBirth, address, email, phoneNumber)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.ok === false) {
          setIsError("A database error occurred while creating your club account, please try again or reload the page.");
          setIsLoading(false);
        }
      })
      .then((data) => {
        localStorage.setItem("fan", username);
        localStorage.setItem("fan_id", data.fan_id.toString());
        router.push("/home-fan");
      });
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Lottie animationData={footballAnimation} loop={true} style={{ width: 300, height: 300 }} />
          <p className="lead display-6 mb-1 mt-5" style={{marginTop: "20px", marginLeft: "30px"}}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-start align-items-center vh-100">
      <div className="text-center">
      <h1
          className="display-4"
          onClick={() => { router.push("/"); setIsLoading(true); }}
          style={{ cursor: "pointer", textDecoration: "none" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          ClubConnect
        </h1>
        <h3 className="display-12">Register (Fan)</h3>
      </div>
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
            minLength={5}
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
          <label htmlFor="address" className="form-label">
            Address
            <p style={{ fontSize: "12px" }}>
              (minimum length of 10 characters)
            </p>
          </label>
          <input
            type="text"
            id="address"
            className="form-control"
            placeholder="Enter your address"
            minLength={10}
            required
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="dateofbirth" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateofbirth"
            className="form-control"
            required
            onChange={(e) => setDateOfBirth(e.target.value)}
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
            type="tel"
            id="phonenumber"
            className="form-control"
            placeholder="Enter your phone number"
            minLength={10}
            required
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/\D/g, '');
            }}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
      <div className="mb-20">
        {isError != "" ? (
          <Alert className="bg-danger text-center text-white rounded">
            {isError}
          </Alert>
        ) : null}
      </div>
    </div>
  );
}
