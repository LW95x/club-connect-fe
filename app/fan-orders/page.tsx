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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClubId = localStorage.getItem('fan_id');
      setFanId(storedClubId);
    }
  }, []);

  useEffect(() => {
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
            throw new Error("No orders found for this Fan ID.");
          }
        })
        .then((ordersWithEvents) => {
          setOrders(ordersWithEvents);
        })
        .catch((error) => {
          console.error(error);
          setIsError("Failed to fetch orders for this Fan ID.");
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  }, [fanId]);

  if (isLoading) {
    return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Lottie animationData={footballAnimation} loop={true} style={{ width: 300, height: 300 }}/>
    </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">{isError}</Alert>;
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
        <ul className="list-unstyled d-flex flex-column align-items-center">
            {orders.map((order) => (
              <li
                key={order.order_id}
                className="my-2"
                style={{ maxWidth: "600px", width: "100%" }}
              >
                <Button
                  variant="light"
                  className="w-100 p-3 border rounded shadow-sm"
                  style={{ textAlign: "center", width: "100%" }}
                >
                  <div className="fw-bold mb-2">
                    {order.title}
                  </div>
                  <div className="text-muted mb-2">{order.description}</div>
                  <div className="text-muted mb-2">
                    Event Date - {order?.date_time?.split("T")[0] || ""} @{" "}
                    {order?.date_time?.split("T")[1].slice(0, 5) || ""}
                  </div>
                  <div className="text-muted mb-4">
                    Location - {order.location}
                  </div>
                  <div className="fw-bold mb-2">
                    Order Details
                  </div>
                  <div className="text-muted mb-2">
                    Order Time & Date - {order.order_date.split("T")[0] || ""} @{" "}
                    {order.order_date.split("T")[1].slice(0, 5) || ""}
                  </div>
                  <div className="text-muted mb-2">
                    Quantity - {order.quantity} 
                  </div>
                  <div className="text-muted mb-2">
                  Total Price - £{order.total_price}
                  </div>
                  <div className="text-muted mb-2">
                    Order Status - <b>{order.order_status}</b>
                  </div>
                </Button>
              </li>
            ))}
        </ul>
    </div>

  );
}
