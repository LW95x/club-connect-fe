import { Club, Fan, Order, Event } from "@/interfaces/interfaces";

const baseUrl = "https://the-football-pyramid-backend.onrender.com/api/";

export function fetchAllFans(): Promise<Fan[]> {
  let url = baseUrl + `fans`;
  return fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export function fetchAllEvents(): Promise<Event[]> {
  const url = baseUrl + `events`;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.events)
    .catch((error) => {
      console.error(error);
      return [];
    });
}

export function fetchAllClubs(): Promise<Club[]> {
  const url = baseUrl + `clubs`;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.clubs)
    .catch((error) => {
      console.error(error);
      return [];
    });
}

export function fetchAllClubEvents(id: string): Promise<Event[]> {
  const url = baseUrl + `clubs/` + id + `/events`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.events)
    .catch((error) => {
      console.error(error);
      return [];
    });
}

export function fetchFanOrders(id: string): Promise<Order[]> {
  const url = baseUrl + `fans/` + id + `/orders`;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.orders)
    .catch((error) => {
      console.error(error);
      return [];
    });
}

export function getEventById(id: string): Promise<Event> {
  const url = baseUrl + `events/` + id;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.event)
    .catch((error) => {
      console.error(error);
      return [];
    });
}

export function getFanById(id: string): Promise<Fan> {
  const url = baseUrl + `fans/` + id;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.fan)
    .catch((error) => {
      console.error(error);
      return [];
    });
}

export function getClubById(id: string): Promise<Club> {
  const url = baseUrl + `clubs/` + id;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.club)
    .catch((error) => {
      console.error(error);
      return [];
    });
}

export function postLoginFan(username: string, password: string) {
  const url = baseUrl + `fans/login`;
  const reqBody = { username: username, password: password };
  const postObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  return fetch(url, postObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function postLoginClub(username: string, password: string) {
  const url = baseUrl + `clubs/login`;
  const reqBody = { username: username, password: password };
  const postObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  return fetch(url, postObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function postNewFan(
  username: string,
  password: string,
  date_of_birth: string,
  address: string,
  email: string,
  phone_number: string
) {
  const url = baseUrl + `fans/register`;
  const reqBody = {
    username: username,
    password: password,
    date_of_birth: date_of_birth,
    address: address,
    email: email,
    phone_number: phone_number,
  };
  const postObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };
  return fetch(url, postObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function postNewClub(
  username: string,
  password: string,
  club_name: string,
  league: string,
  location: string,
  stadium_capacity: number,
  email: string,
  phone_number: string,
  website?: string,
  facebook?: string,
  twitter?: string
) {
  const url = baseUrl + `clubs/register`;
  const reqBody: {
    username: string;
    password: string;
    club_name: string;
    league: string;
    location: string;
    stadium_capacity: number;
    email: string;
    phone_number: string;
    website?: string;
    facebook?: string;
    twitter?: string;
  } = {
    username,
    password,
    club_name,
    league,
    location,
    stadium_capacity,
    email,
    phone_number,
  };

  if (website) reqBody.website = website;
  if (facebook) reqBody.facebook = facebook;
  if (twitter) reqBody.twitter = twitter;

  const postObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };
  return fetch(url, postObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function updateFanPassword(
  id: string,
  current_password: string,
  new_password: string
) {
  const url = baseUrl + `fans/` + id + `/change-password`;
  const reqBody = {
    current_password: current_password,
    new_password: new_password,
  };
  const patchObject = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  return fetch(url, patchObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function updateFan(
  id: string,
  date_of_birth: string,
  email: string,
  address: string,
  phone_number: string
) {
  const url = baseUrl + `fans/` + id;
  const reqBody = {
    date_of_birth: date_of_birth,
    email: email,
    address: address,
    phone_number: phone_number,
  };
  const patchObject = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  return fetch(url, patchObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function updateClubPassword(
  id: string,
  current_password: string,
  new_password: string
) {
  const url = baseUrl + `clubs/` + id + `/change-password`;
  const reqBody = {
    current_password: current_password,
    new_password: new_password,
  };
  const patchObject = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  return fetch(url, patchObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function updateClub(
  id: string,
  email: string,
  location: string,
  phone_number: string,
  club_name: string,
  league: string,
  stadium_capacity: number,
  website?: string,
  facebook?: string,
  twitter?: string
) {
  const url = baseUrl + `clubs/` + id;
  const reqBody: {
    email: string;
    location: string;
    phone_number: string;
    club_name: string;
    league: string;
    stadium_capacity: number;
    website?: string;
    facebook?: string;
    twitter?: string;
  } = {
    email,
    location,
    phone_number,
    club_name,
    league,
    stadium_capacity,
  };

  if (website) reqBody.website = website;
  if (facebook) reqBody.facebook = facebook;
  if (twitter) reqBody.twitter = twitter;

  const patchObject = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  return fetch(url, patchObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function postNewEvent(
  id: string,
  title: string,
  location: string,
  price: number,
  date_time: string,
  description: string,
  available_tickets: number
) {
  const url = baseUrl + `clubs/` + id + `/events`;
  const reqBody = {
    title: title,
    location: location,
    price: price,
    date_time: date_time,
    description: description,
    available_tickets: available_tickets,
  };
  const postObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };
  return fetch(url, postObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function postNewOrder(
  id: string,
  event_id: string,
  order_date: string,
  quantity: number,
  total_price: number,
  order_status: string,
  add_to_calendar: boolean,
  token?: string
) {
  const url = baseUrl + `fans/` + id + `/orders`;
  const reqBody = {
    event_id: event_id,
    order_date: order_date,
    quantity: quantity,
    total_price: total_price,
    order_status: order_status,
    add_to_calendar: add_to_calendar,
  };
  const postObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reqBody),
  };
  return fetch(url, postObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function updateEvent(
  clubId: string,
  eventId: string,
  available_tickets?: number,
  title?: string,
  location?: string,
  price?: number,
  date_time?: string,
  description?: string
) {
  const url = baseUrl + `clubs/` + clubId + `/events/` + eventId;
  const reqBody = {
    available_tickets: available_tickets,
    title: title,
    location: location,
    price: price,
    date_time: date_time,
    description: description,
  };
  const patchObject = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  return fetch(url, patchObject)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export function updateOrder(
  fanId: string,
  orderId: string,
  updates: {
  order_status?: string;
  quantity?: number;
  total_price?: number;
  }
) {
  const url = baseUrl + `fans/` + fanId + `/orders/` + orderId;

  const patchObject = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  };

  return fetch(url, patchObject)
  .then((res) => {
    return res;
  })
  .catch((error) => {
    return error;
  });
}
