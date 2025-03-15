export interface User {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $updatedAt: string;
  auth_id: number;
  firstname: string;
  email: string;
  lastname: string;
  image: string;
  tickets: any[]; // Change this if you have a Ticket type
}

export interface NewUser {
  firstname: string;
  lastname: string;
  email: string;
  image: string;
}

export interface Trip {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $updatedAt: string;
  car_type: string;
  destination_location_city: string;
  destination_location_state: string;
  end_date_time: string;
  passenger_count: number;
  price: number;
  start_date_time: string;
  start_location_city: string;
  start_location_state: string;
  tickets: any[]; // Change this if you have a Ticket type
  users: User;
}

export type NewTicket = {
  users: string;
  trip: string;
  payment_status: "ONHOLD" | "APPROVED";
  payment_type: "PAY_NOW" | "PAY_LATER";
};

export enum PaymentType {
  PAY_NOW = "PAY_NOW",
  PAY_LATER = "PAY_LATER",
}

export interface TripEditing {
  start_location_city: string;
  car_type: string;
  destination_location_city: string;
  destination_location_state: string;
  end_date_time: string;
  passenger_count: number;
  price: number;
  start_date_time: string;
  start_location_state: string;
  users: string;
}

export interface User {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[]; // Adjust type if needed
  $updatedAt: string;
  auth_id: number;
  firstname: string;
  lastname: string;
  tickets: any[]; // Adjust if tickets have a defined structure
  trips: Trip[];
}

export type Ticket = {
  users: User;
  trip: Trip;
  payment_status: "ONHOLD" | "APPROVED";
  payment_type: "PAY_NOW" | "PAY_LATER";
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id?: string;
  $permissions: string[]; // Adjust type if needed
  $updatedAt: string;
};

export interface FormattedTimeData {
  formattedStartTime: string;
  formattedStartDate: string;
  formattedEndTime: string;
  formattedEndDate: string;
  duration: string;
}
