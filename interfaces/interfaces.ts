export interface Event {
  event_id?: number;
  home_club_id?: number;
  title?: string;
  location?: string;
  price?: string;
  date_time?: string;
  description?: string;
  available_tickets?: number;
}

export interface Club {
  club_id?: number;
  username?: string;
  club_name?: string;
  league?: string;
  location?: string;
  stadium_capacity?: number;
  email?: string;
  phone_number?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  event_id: number;
  order_date: string;
  quantity: number;
  total_price: string;
  order_status: string;
}

export interface Fan {
  fan_id?: number;
  username?: string;
  date_of_birth?: string;
  address?: string;
  email?: string;
  phone_number?: string;
}

export interface OrderWithEvent extends Order {
  home_club_id?: number;
  title?: string;
  location?: string;
  price?: string;
  date_time?: string;
  description?: string;
  available_tickets?: number;
}
