import { ID, Query } from "react-native-appwrite";
import { DATABASE_ID, databases } from "../appwriteConfig";
import { Trip, TripEditing } from "../types";

const COLLECTION_ID = "hitch-trip";

// ✅ Fetch all trips
export const fetchTrips = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.documents;
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
};

// ✅ Fetch a single trip
export const fetchTrip = async (tripId: string) => {
  try {
    return await databases.getDocument(DATABASE_ID, COLLECTION_ID, tripId);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return null;
  }
};

// ✅ Fetch trips by user ID
export const fetchTripsByUser = async (userId: string) => {
  console.log("user id: ", userId);
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.documents.filter(
      (trip) => String(trip.users.$id) == userId
    );
  } catch (error) {
    console.error("Error fetching trips by user ID:", error);
    return [];
  }
};

// ✅ Create a trip
export const createTrip = async (tripData: TripEditing) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      "hitch-trip", // Collection ID
      ID.unique(), // Let Appwrite generate an ID
      tripData
    );
    console.log("Trip Created:", response);
    return response;
  } catch (error) {
    console.error("Error creating trip:", error);
  }
};

// ✅ Update a trip
export const updateTrip = async (tripId: string, tripData: any) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      tripId,
      tripData
    );
  } catch (error) {
    console.error("Error updating trip:", error);
    return null;
  }
};

// ✅ Delete a trip
export const deleteTrip = async (tripId: string) => {
  try {
    return await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, tripId);
  } catch (error) {
    console.error("Error deleting trip:", error);
  }
};
