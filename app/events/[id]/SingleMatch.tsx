"use client";
import { useState, useEffect, FormEvent, Dispatch, SetStateAction } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Card } from "react-bootstrap";
import { getEventById, postNewOrder, updateEvent, updateOrder } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Event } from "@/interfaces/interfaces";
import Lottie from "lottie-react";
import footballAnimation from "../../_lib/football.json";
import FanNavBar from "@/app/_lib/FanNavBar";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QuewzRKD3S7G8yDl9RXe30tQfNhC7BpBjjbcp8l66meJp3tLtXudKyqQymQPmBRlsXb5JQIEpsDnt0WIQC3Uo9p00AUvvsc9U"
);

const StripePaymentForm = ({
  eventId,
  fanId,
  quantity,
  addToCalendar,
  token,
  eventPrice,
  setIsSuccess,
  currentTickets,
  setCurrentTickets,
  event
}: {
  eventId: string;
  fanId: string | null;
  quantity: number;
  addToCalendar: boolean;
  token: string | null;
  eventPrice: number;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  currentTickets: number | undefined;
  setCurrentTickets: Dispatch<SetStateAction<number | undefined>>
  event: Event | undefined;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handlePayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      setPaymentError("Stripe has not been initialized.");
      setProcessing(false);
      return;
    }

    try {
      const orderResponse = await postNewOrder(
        fanId || "",
        eventId,
        new Date().toISOString(),
        quantity,
        eventPrice * quantity,
        "Pending",
        addToCalendar,
        token || ""
      );

      if (!orderResponse.ok) {
        setPaymentError("Failed to create order. Please try again.");
        setProcessing(false);
        return;
      }

      const orderData = await orderResponse.json();
      setClientSecret(orderData.clientSecret);
      console.log(orderData);

      if (!orderData.clientSecret) {
        setPaymentError("Payment processing error. No client secret received.");
        setProcessing(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setPaymentError("Payment method is not ready.");
        setProcessing(false);
        return;
      }

      const paymentResult = await stripe.confirmCardPayment(
        orderData.clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      if (paymentResult.error) {
        setPaymentError(paymentResult.error.message || "Payment failed.");
      } else {
        setIsSuccess(true);
        console.log("Payment successful:", paymentResult);
      }

      const updateResponse = await updateOrder(fanId || "", orderData.order.order_id, { order_status: "Completed" });

      if (updateResponse.ok) {
        console.log("Order status marked as completed.");
      } else {
        console.error("Failed to update order status.");
      }

      const updateEventQuantity = await updateEvent(event?.home_club_id?.toString() ?? "", eventId, (currentTickets ?? 0) - quantity);

      if (updateEventQuantity.ok) {
        setCurrentTickets((currentTickets ?? 0) - quantity);
        console.log("Updated event ticket quantity.")
      } else {
        console.error("Failed to update event ticket quantity.")
      }

    } catch (error) {
      console.error(error);
      setPaymentError("An unexpected error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handlePayment}
      className="w-100"
      style={{ maxWidth: "600px" }}
    >
      <div
        style={{
          border: "1px solid #ffffff",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "1rem",
          backgroundColor: "#222222",
        }}
      >
        <CardElement
          options={{
            style: {
              base: { fontSize: "18px", color: "#ffffff", backgroundColor: "#222222" },
              invalid: { color: "#8B0000" },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={processing}
      >
        {processing ? "Processing..." : "Order Now"}
      </button>

      {paymentError && (
        <Alert className="bg-danger text-center text-white rounded mt-2">
          {paymentError}
        </Alert>
      )}
    </form>
  );
};

export default function SingleMatch({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState("");
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { id } = params;
  const [fanId, setFanId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpirationTime, setTokenExpirationTime] = useState<string | null>(
    null
  );
  const isTokenExpired =
    !tokenExpirationTime || Date.now() >= Number(tokenExpirationTime);
  const [currentTickets, setCurrentTickets] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedClubId = localStorage.getItem("fan_id");
      const storedToken = localStorage.getItem("accessToken");
      const storedTokenExpirationTime = localStorage.getItem("tokenExpired");
      setFanId(storedClubId);
      setToken(storedToken);
      setTokenExpirationTime(storedTokenExpirationTime);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getEventById(id)
        .then((res) => {
          setEvent(res);
          setCurrentTickets(res.available_tickets);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          setIsError(
            "A database error occurred while fetching the event, please try again or reload the page."
          );
        });
    } else {
      setIsLoading(false);
      setIsError(
        "An error occurred fetching the event's ID, please try again or reload the page."
      );
    }
  }, [id]);

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

  const handleAddToCalendar = () => {
    const clientId =
      "610240236325-tvtkgptkdqdsfoli9ra2eahiscs23pl8.apps.googleusercontent.com";

    const redirectUri =
      window.location.hostname === "localhost"
        ? "http://localhost:3000/callback"
        : "https://clubconnects.netlify.app/callback";

    const scope = "https://www.googleapis.com/auth/calendar.events";

    localStorage.setItem("lastPage", window.location.pathname);

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&include_granted_scopes=true`;
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="container-fluid d-flex flex-column justify-content-start align-items-center vh-100 vw-100 p-0">
        <h1
          className="display-4 text-white mt-2"
          onClick={() => {
            router.push("/home-fan");
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
        <FanNavBar />
        <div
        className="bg-dark text-white p-2 rounded-xl mt-2 opacity-75 flex items-center justify-center"
        style={{ borderRadius: "12px", height: "50px"}}
      >
        <h3 className="display-12 text-white text-center">Order Tickets</h3>
      </div>
        <ul className="list-unstyled d-flex flex-column align-items-center w-100">
          <li
            key={event?.event_id}
            className="my-2 w-100 d-flex justify-content-center"
          >
            <Card 
              className="p-3 border rounded shadow-sm text-start border-dark bg-dark text-white opacity-75"
              style={{ maxWidth: "600px", width: "100%" }}
            >
              <h5 className="fw-bold mb-2 text-center">{event?.title}</h5>
              <div className="text-white mb-2 text-center">
                {event?.description}
              </div>
              <hr />
              <div className="text-white mb-1">
                <b>Price:</b> £{event?.price}
              </div>
              <div className="text-white mb-1">
                <b>Location:</b> {event?.location}
              </div>
              <div className="text-white mb-1">
                <b>Date:</b> {event?.date_time?.split("T")[0]} @{" "}
                {event?.date_time?.split("T")[1].slice(0, 5)}
              </div>
              <div className="text-white mb-1">
                <b>Available Tickets:</b> {currentTickets}
              </div>
            </Card>
          </li>
          <div className="p-2 rounded bg-dark text-light text-center opacity-75">
            <label className="form-check-label">
              Add this event to your Google Calendar?
              <input
                type="checkbox"
                className="form-check-input p-1"
                style={{ marginLeft: "12px" }}
                checked={addToCalendar}
                onChange={(e) => setAddToCalendar(e.target.checked)}
              />
            </label>
          </div>
        </ul>
        {token && !isTokenExpired ? (
          <Alert
            className="bg-success text-center text-white rounded opacity-75"
            style={{ maxWidth: "600px" }}
          >
            You are successfully authenticated with Google Calendar. 
          </Alert>
        ) : (
          <Alert
            className="bg-dark text-center text-white rounded opacity-75"
            style={{ maxWidth: "600px" }}
          >
            You are not currently authenticated with Google Calendar. 
            <hr /> Click{" "}
            <span
              onClick={handleAddToCalendar}
              className="text-primary fw-bold cursor-pointer"
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              here
            </span>{" "}
            to allow us permission to add events to your Google Calendar.
          </Alert>
        )}
        <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <label className="mt-2 mb-2 p-2 rounded bg-dark text-white text-center" style={{ border: "1px solid white" }}>Quantity:</label>
          <input
            type="number"
            style={{ width: "60px" }}
            className="form-control mx-2 p-2 bg-dark text-white border-dark border-1 border-white"
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
            max="10"
            value={quantity}
            required
          />
          </div>
        <div className="mt-2 mb-2 p-2 rounded bg-dark text-white text-center" style={{ border: "1px solid white", marginLeft: "50px" }}>
          <b>Total Price:</b>{" "}
          <i>
            £
            {isNaN(quantity * (parseInt(event?.price ?? "0") || 0))
              ? 0
              : quantity * (parseInt(event?.price ?? "0") || 0)}
            .00
          </i>
        </div>
        </div>
        <StripePaymentForm
          eventId={id}
          fanId={fanId}
          quantity={quantity}
          addToCalendar={addToCalendar}
          token={token}
          eventPrice={parseFloat(event?.price ?? "0")}
          setIsSuccess={setIsSuccess}
          currentTickets={currentTickets}
          setCurrentTickets={setCurrentTickets}
          event={event}
        />

        <div className="mt-1">
          {isSuccess ? (
            <Alert className="bg-success text-center text-white rounded">
              Your order has been successfully created.
            </Alert>
          ) : null}
          {isError != "" ? (
            <Alert className="bg-danger text-center text-white rounded">
              {isError}
            </Alert>
          ) : null}
        </div>
      </div>
    </Elements>
  );
}
