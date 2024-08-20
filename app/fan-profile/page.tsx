"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { getFanById, updateFanPassword, updateFan } from "@/utils/api";
import { Fan } from "@/interfaces/interfaces";
import { Alert, Button } from "react-bootstrap";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";
import FanNavBar from "../_lib/FanNavBar";

export default function FanProfile() {
  const [fan, setFan] = useState<Fan>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const router = useRouter();
  const [fanId, setFanId] = useState<string | null>(null);
  const [isFanIdLoaded, setIsFanIdLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFanId = localStorage.getItem("fan_id");
      setFanId(storedFanId);
      setIsFanIdLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isFanIdLoaded) return;

    if (fanId) {
      getFanById(fanId)
        .then((fan) => {
          setFan(fan);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          setIsError("A database error occurred while attempting to fetch your profile data, please try again or reload the page.")
        });
    } else {
      setIsLoading(false);
      setIsError(`Your Fan ID could not be found, please log back in from the home page.`);
    }
  }, [fanId, isFanIdLoaded]);

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess("");
    setIsError("");
    if (fanId) {
      updateFanPassword(fanId, currentPassword, newPassword).then((res) => {
        if (res.ok) {
          setIsLoading(false);
          setIsSuccess("Password succesfully updated.");
          return res.json();
        } else if (res.ok === false) {
          setIsError("Password request change failed - Incorrect current password provided.");
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
      setIsError(`Your Fan ID could not be found, please log back in from the home page.`);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess("");
    setIsError("");
    if (fan && fanId) {
      updateFan(
        fanId,
        fan.date_of_birth ?? "",
        fan.email ?? "",
        fan.address ?? "",
        fan.phone_number ?? ""
      ).then((res) => {
        if (res.ok) {
          setIsLoading(false);
          setIsSuccess("User details succesfully updated.");
          return res.json();
        } else if (res.ok === false) {
          setIsError("A database error occurred while attempting to update your club profile, please try again or reload the page.");
          setIsLoading(false);
        }
      });
    }
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
    <div className="container-fluid d-flex flex-column justify-content-start align-items-center vh-100 vw-100 p-0">
        <h1
          className="display-4"
          onClick={() => {router.push("/home-fan"); setIsLoading(true); }}
          style={{ cursor: "pointer", textDecoration: "none" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          ClubConnect
        </h1>
        <FanNavBar />
        <h3 className="display-12 mt-5">Fan Profile</h3>
      <form className="w-75" onSubmit={handlePasswordSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="currentpassword" className="form-label">
            Current Password
          </label>
          <input
            type="password"
            id="currentpassword"
            className="form-control"
            placeholder="Enter your current password"
            required
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="newpassword" className="form-label">
            New Password
            <p style={{ fontSize: "12px" }}>
              (Password must contain one digit from 1 to 9, one lowercase
              letter, one uppercase letter, one special character, no space, and
              it must be 8-16 characters long)
            </p>
          </label>
          <input
            type="password"
            id="newpassword"
            className="form-control"
            placeholder="Enter your new password"
            pattern="^(?=.*\d)(?=.*[A-Z]).{8,16}$"
            required
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="d-flex flex-column align-items-center mb-5">
          <button type="submit" className="btn btn-primary mb-2" style={{width: "300px"}}>
            Update Password
          </button>
        </div>
      </form>
      {isSuccess != "" ? (
            <Alert className="bg-success text-center text-white rounded">
              {isSuccess}
            </Alert>
          ) : null}
      {isError != "" ? (
            <Alert className="bg-danger text-center text-white rounded">
              {isError}
            </Alert>
          ) : null}
      <form className="w-75 mt-10" onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="dob" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            className="form-control"
            value={fan?.date_of_birth?.split("T")[0] || ""}
            onChange={(e) => setFan({ ...fan, date_of_birth: e.target.value })}
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
            value={fan?.email}
            onChange={(e) => setFan({ ...fan, email: e.target.value })}
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
            minLength={10}
            value={fan?.address}
            onChange={(e) => setFan({ ...fan, address: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="phonenumber" className="form-label">
            Phone Number
            <p style={{ fontSize: "12px" }}>
              (minimum length of 10 characters)
            </p>
          </label>
          <input
            type="tel"
            id="phonenumber"
            className="form-control"
            minLength={10}
            value={fan?.phone_number}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/\D/g, '');
            }}
            onChange={(e) => setFan({ ...fan, phone_number: e.target.value })}
          />
        </div>
        <div className="d-flex justify-content-center mb-5">
          <button type="submit" className="btn btn-primary" style={{width: "300px"}}>
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
