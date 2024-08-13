"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { fetchFanOrders, getEventById } from "@/utils/api";
import { OrderWithEvent } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";

export default function FanOrders() {
  const [orders, setOrders] = useState<OrderWithEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const router = useRouter();
  const [fanId, setFanId] = useState<string | null>(null);
  const [isFanIdLoaded, setIsFanIdLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClubId = localStorage.getItem('fan_id');
      setFanId(storedClubId);
      setIsFanIdLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isFanIdLoaded) return;

    if (fanId) {
      setIsLoading(true);
      fetchFanOrders(fanId)
        .then((orderList) => {
          if (orderList.length > 0) {
            return Promise.all(
              orderList.map((order) => {
                return getEventById(order.event_id.toString()).then((event) => {
                  const combinedEventOrder = {
                    ...order,
                    ...event,
                  };
                  return combinedEventOrder;
                });
              }),
            );
          } else {
            setIsLoading(false);
            setIsError("No orders found for this Fan ID.");
          }
        })
        .then((ordersWithEvents) => {
          setOrders(ordersWithEvents || []);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          setIsError("Failed to fetch orders for this Fan ID.");
        })
        .finally(() => {
          setIsLoading(false);
        })
    } else {
      setIsLoading(false);
      setIsError(`Your Fan ID could not be found, please log back in from the home page.`);
    }
  }, [fanId, isFanIdLoaded]);

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
      <h1
        className="display-4"
        onClick={() => { router.push("/home-fan"); setIsLoading(true); }}
        style={{ cursor: "pointer", textDecoration: "none" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ClubConnect
      </h1>
      <h3 className="display-12">Your Orders</h3>
      {isError != "" ? (
            <Alert className="bg-danger text-center text-white rounded">
              {isError}
            </Alert>
          ) : null}
        <ul className="list-unstyled d-flex flex-column">
            {orders.map((order) => (
              <li
                key={order.order_id}
                className="my-2"
                style={{ maxWidth: "600px", width: "100%" }}
              >
                <Button
                  variant="light"
                  className="w-100 p-3 border rounded shadow-sm text-start"
                  style={{ textAlign: "center", width: "100%" }}
                >
                  <h5 className="fw-bold mb-3 text-center">
                    {order.title}
                  </h5>
                  <div className="text-muted mb-3 text-center">{order.description}</div>
                  <hr/>
                  <div className="text-muted mb-2">
                    <b>Event Date:</b> {order?.date_time?.split("T")[0] || ""} @{" "}
                    {order?.date_time?.split("T")[1].slice(0, 5) || ""}
                  </div>
                  <div className="text-muted mb-4">
                    <b>Location:</b> {order.location}
                  </div>
                  <hr />
                  <div className="fw-bold mb-2 text-center">
                    Order Details
                  </div>
                  <hr />
                  <div className="text-muted mb-2">
                    <b>Order Time & Date:</b> {order.order_date.split("T")[0] || ""} @{" "}
                    {order.order_date.split("T")[1].slice(0, 5) || ""}
                  </div>
                  <div className="text-muted mb-2">
                   <b>Quantity:</b> {order.quantity} 
                  </div>
                  <div className="text-muted mb-2">
                  <b>Total Price:</b> £{order.total_price}
                  </div>
                  <div className="text-muted mb-2">
                    <b>Order Status:</b> <i>{order.order_status}</i>
                  </div>
                </Button>
              </li>
            ))}
        </ul>
    </div>

  );
}
