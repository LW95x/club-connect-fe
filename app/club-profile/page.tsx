"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { Club } from "@/interfaces/interfaces";
import { getClubById, updateClub, updateClubPassword } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function ClubProfile() {
  const [club, setClub] = useState<Club>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const router = useRouter();
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClubId = localStorage.getItem('club_id');
      setClubId(storedClubId);
    }
  }, []);

  useEffect(() => {
    if (clubId) {
      getClubById(clubId)
        .then((club) => {
          setClub(club);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [clubId]);

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess("");
    setIsError("");
    if (clubId) {
    updateClubPassword(clubId, currentPassword, newPassword).then((res) => {
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
    if (club && clubId) {
      updateClub(
        clubId,
        club.email ?? "",
        club.location ?? "",
        club.phone_number ?? "",
        club.club_name ?? "",
        club.league ?? "",
        club.stadium_capacity ?? 0,
        club.website,
        club.facebook,
        club.twitter,
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
        {" "}
        <h1
          className="display-4"
          onClick={() => router.push("/home-club")}
          style={{ cursor: "pointer", textDecoration: "none" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          ClubConnect
        </h1>
        <h3 className="display-12">Club Profile</h3>
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
            pattern="^(?=.*\d)(?=.*[A-Z]).{8,16}$"
            required
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="newpassword" className="form-label">
            New Password{" "}
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
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={club?.email || ""}
            onChange={(e) => setClub({ ...club, email: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="location" className="form-label">
            Location
            <p style={{ fontSize: "12px" }}>
              (minimum length of 10 characters)
            </p>
          </label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={club?.location || ""}
            onChange={(e) => setClub({ ...club, location: e.target.value })}
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
            value={club?.phone_number || ""}
            onChange={(e) => setClub({ ...club, phone_number: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="clubname" className="form-label">
            Club Name
            <p style={{ fontSize: "12px" }}>(minimum length of 5 characters)</p>
          </label>
          <input
            type="text"
            id="clubname"
            className="form-control"
            value={club?.club_name || ""}
            onChange={(e) => setClub({ ...club, club_name: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="league" className="form-label">
            League
            <p style={{ fontSize: "12px" }}>(minimum length of 5 characters)</p>
          </label>
          <input
            type="text"
            id="league"
            className="form-control"
            value={club?.league || ""}
            onChange={(e) => setClub({ ...club, league: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="capacity" className="form-label">
            Stadium Capacity
          </label>
          <input
            type="text"
            id="capacity"
            className="form-control"
            value={club?.stadium_capacity || ""}
            onChange={(e) =>
              setClub({ ...club, stadium_capacity: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="website" className="form-label">
            Website <p style={{ fontSize: "12px" }}>(optional)</p>
          </label>
          <input
            type="text"
            id="website"
            className="form-control"
            placeholder="Enter your new website address"
            value={club?.website || ""}
            onChange={(e) => setClub({ ...club, website: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="facebook" className="form-label">
            Facebook <p style={{ fontSize: "12px" }}>(optional)</p>
          </label>
          <input
            type="text"
            id="facebook"
            className="form-control"
            placeholder="Enter your new facebook address"
            value={club?.facebook || ""}
            onChange={(e) => setClub({ ...club, facebook: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="twitter" className="form-label">
            Twitter <p style={{ fontSize: "12px" }}>(optional)</p>
          </label>
          <input
            type="text"
            id="twitter"
            className="form-control"
            placeholder="Enter your new twitter address"
            value={club?.twitter || ""}
            onChange={(e) => setClub({ ...club, twitter: e.target.value })}
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
