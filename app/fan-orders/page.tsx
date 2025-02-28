"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Card } from "react-bootstrap";
import { fetchFanOrders, getEventById } from "@/utils/api";
import { OrderWithEvent } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import footballAnimation from "../_lib/football.json";
import FanNavBar from "../_lib/FanNavBar";

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
            setIsError("No orders found for this Fan ID. You can navigate back to your home page by clicking on the ClubConnect header above.");
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
          <p className="lead display-6 mb-1 mt-5 text-white font-bold" style={{marginTop: "20px", marginLeft: "30px"}}>Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="container-fluid d-flex flex-column justify-content-start align-items-center vh-100 vw-100 p-0">
      <h1
        className="display-4 text-white mt-2"
        onClick={() => { router.push("/home-fan"); setIsLoading(true); }}
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
        <h3 className="display-12 text-white text-center">Your Orders</h3>
      </div>
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
                <Card
                  className="w-100 p-3 border-dark border rounded shadow-sm text-start mb-4 bg-dark text-white opacity-75"
                  style={{ textAlign: "center", width: "100%" }}
                >
                  <h5 className="fw-bold mb-3 text-center">
                    {order.title}
                  </h5>
                  <div className="mb-3 text-center">{order.description}</div>
                  <hr/>
                  <div className="mb-2">
                    <b>Event Date:</b> {order?.date_time?.split("T")[0] || ""} @{" "}
                    {order?.date_time?.split("T")[1].slice(0, 5) || ""}
                  </div>
                  <div className="mb-4">
                    <b>Location:</b> {order.location}
                  </div>
                  <hr />
                  <div className="fw-bold mb-2 text-center">
                    Order Details
                  </div>
                  <hr />
                  <div className="mb-2">
                    <b>Order Time & Date:</b> {order.order_date.split("T")[0] || ""} @{" "}
                    {order.order_date.split("T")[1].slice(0, 5) || ""}
                  </div>
                  <div className="mb-2">
                   <b>Quantity:</b> {order.quantity} 
                  </div>
                  <div className="mb-2">
                  <b>Total Price:</b> £{order.total_price}
                  </div>
                  <div className="mb-2">
                    <b>Order Status:</b> <i>{order.order_status}</i>
                  </div>
                </Card>
              </li>
            ))}
        </ul>
    </div>

  );
}
