"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { getFanById, updateFanPassword, updateFan } from "@/utils/api";
import { Fan } from "@/interfaces/interfaces";
import { Alert, Button } from "react-bootstrap";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";

export default function FanProfile() {
  const [fan, setFan] = useState<Fan>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const router = useRouter();
  const [fanId, setFanId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFanId = localStorage.getItem("fan_id");
      setFanId(storedFanId);
    }
  }, []);

  useEffect(() => {
    if (fanId) {
      getFanById(fanId)
        .then((fan) => {
          setFan(fan);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [fanId]);

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
          setIsError("Password request change failed.");
          setIsLoading(false);
        }
      });
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
          setIsError("User update request failed.");
          setIsLoading(false);
        }
      });
    }
  };

  if (isLoading) {
    return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Lottie animationData={footballAnimation} loop={true} style={{ width: 300, height: 300 }}/>
    </div>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-start align-items-center vh-100">
      <div className="text-center">
        {" "}
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
        <h3 className="display-12">Fan Profile</h3>
      </div>
      <form className="w-100" onSubmit={handlePasswordSubmit}>
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
        <div className="d-flex flex-column align-items-end mb-5">
          <button type="submit" className="btn btn-primary mb-2" style={{width: "300px"}}>
            Update Password
          </button>
          <div className="mt-2">
            {isSuccess && <span className="text-success">{isSuccess}</span>}
            {isError && <span className="text-danger">{isError}</span>}
          </div>
        </div>
      </form>
      <form className="w-100 mt-10" onSubmit={handleSubmit}>
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
            onChange={(e) => setFan({ ...fan, phone_number: e.target.value })}
          />
        </div>
        <div className="d-flex justify-content-end mb-5">
          <button type="submit" className="btn btn-primary" style={{width: "300px"}}>
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
