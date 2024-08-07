"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button } from "react-bootstrap";
import { fetchFanOrders, getEventById } from "@/utils/api";
import { OrderWithEvent } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";

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
        });
    } else {
      setIsLoading(false);
    }
  }, [fanId]);

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
      <h1
        className="display-4"
        onClick={() => router.push("/home-fan")}
        style={{ cursor: "pointer", textDecoration: "none" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ClubConnect
      </h1>
      <h3 className="display-12">Your Orders</h3>
      <div>
        <ul className="list-unstyled d-flex flex-column align-items-center">
          {orders.length > 0 ? (
            orders.map((order) => (
              <li
                key={order.order_id}
                className="my-2 w-100"
                style={{ maxWidth: "600px" }}
              >
                <Button
                  variant="light"
                  className="w-100 p-3 border rounded shadow-sm"
                  style={{ textAlign: "center" }}
                >
                  <div className="fw-bold mb-2">
                    Event ID - {order.event_id}
                  </div>
                  <div className="text-muted mb-2">
                    Order Date - {order.order_date.split("T")[0] || ""} @{" "}
                    {order.order_date.split("T")[1].slice(0, 5) || ""}
                  </div>
                  <div className="text-muted mb-2">
                    Quantity - {order.quantity}
                  </div>
                  <div className="text-muted mb-2">
                    Order Status - {order.order_status}
                  </div>
                  <div className="text-muted mb-2">
                    Total Price - {order.total_price}
                  </div>
                  <div className="text-muted mb-2">{order.title}</div>
                  <div className="text-muted mb-2">{order.description}</div>
                  <div className="text-muted mb-2">
                    Event Date - {order?.date_time?.split("T")[0] || ""} @{" "}
                    {order?.date_time?.split("T")[1].slice(0, 5) || ""}
                  </div>
                  <div className="text-muted mb-2">
                    Location - {order.location}
                  </div>
                </Button>
              </li>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </ul>
        {isError && <h3 style={{ color: "red" }}>{isError}</h3>}
      </div>
    </div>
  );
}
