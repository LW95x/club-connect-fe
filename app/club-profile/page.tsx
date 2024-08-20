"use client";
import { useState, useEffect, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { Club } from "@/interfaces/interfaces";
import { getClubById, updateClub, updateClubPassword } from "@/utils/api";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";
import ClubNavBar from "../_lib/ClubNavBar";

export default function ClubProfile() {
  const [club, setClub] = useState<Club>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const router = useRouter();
  const [clubId, setClubId] = useState<string | null>(null);
  const [isClubIdLoaded, setIsClubIdLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClubId = localStorage.getItem('club_id');
      setClubId(storedClubId);
      setIsClubIdLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isClubIdLoaded) return;

    if (clubId) {
      getClubById(clubId)
        .then((club) => {
          setClub(club);
          setIsLoading(false);
          setIsSuccess("");
          setIsError("");
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error);
          setIsError("Your Club ID could not be found, please log back in from the home page.")
        });
    } else {
      setIsLoading(false);
      setIsError(`Your Club ID could not be found, please log back in from the home page.`);
    }
  }, [clubId, isClubIdLoaded]);

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
        setIsError("Password request change failed - Incorrect current password provided.");
        setIsLoading(false);
      }
    });
  } else {
    setIsLoading(false);
    setIsError(`Your Club ID could not be found, please log back in from the home page.`);
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
          setIsLoading(false);
          setIsError("A database error occurred while attempting to update your club profile, please try again or reload the page.");
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
          onClick={() => { router.push("/home-club"); setIsLoading(true); }}
          style={{ cursor: "pointer", textDecoration: "none" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          ClubConnect
        </h1>
        <ClubNavBar />
        <h3 className="display-12 mt-3">Club Profile</h3>
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
            minLength={10}
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
            minLength={10}
            value={club?.phone_number}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/\D/g, '');
            }}
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
            minLength={5}
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
            minLength={5}
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
            min="1"
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
            type="url"
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
            type="url"
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
            type="url"
            id="twitter"
            className="form-control"
            placeholder="Enter your new twitter address"
            value={club?.twitter || ""}
            onChange={(e) => setClub({ ...club, twitter: e.target.value })}
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
