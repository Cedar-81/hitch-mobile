import { ID, Query } from "react-native-appwrite";
import { DATABASE_ID, databases } from "../appwriteConfig";
import { NewTicket, Ticket } from "../types";
import { generateHash, generateUniqueCode } from "../helpers";

const COLLECTION_ID = "hitch-tickets"; // Replace with your actual collection ID

// ✅ Fetch all tickets
export const fetchTickets = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.documents;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

// ✅ Fetch a single ticket
export const fetchTicket = async (ticketId: string) => {
  try {
    return await databases.getDocument(DATABASE_ID, COLLECTION_ID, ticketId);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return null;
  }
};

// ✅ Fetch tickets by user ID
export const fetchTicketsByUser = async (userId: string) => {
  try {
    console.log("\n\nuserid: ", userId);
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    console.log("\nuserid_tickets", response);
    response.documents.forEach((ticket) => {
      console.log("\n\n users: ", ticket.users.$id, "\n");
    });
    return response.documents.filter((tickets) => tickets.users.$id == userId);
    // return response.documents;
  } catch (error) {
    console.error("Error fetching tickets by user ID:", error);
    return [];
  }
};

export const getTicketByHash = async (code: string, id: string) => {
  const hash = generateHash(code, id);
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    const match = response.documents.find((ticket) => ticket.hash === hash);
    if (!match) {
      throw new Error("Invalid ticket code");
    }
  } catch (err) {
    throw new Error("Couldnt retrieve tickets");
  }
};

// export const getAndUpdateTicketCode = async (code: string) => {
//   try {
//     const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
//     const match = response.documents.find(
//       (ticket) => String(ticket.code) === code
//     );
//     if (!match) {
//       throw new Error("Invalid ticket code");
//     }

//     try {
//       await updateTicket(match.$id, { code: Number(code) });
//     } catch {
//       console.log("Couldnt update ticket code");
//       return new Error("Couldnt update ticket code");
//     }
//   } catch (err) {
//     console.log("Couldnt retrieve tickets");
//     return Error("Couldnt retrieve tickets");
//   }
// };

export const getAndUpdateTicketPayment = async (code: string) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    const match = response.documents.find(
      (ticket) => String(ticket.code) === code
    );
    if (!match) {
      throw new Error("Invalid ticket code");
    }

    try {
      await updateTicket(match.$id, {
        payment_status: "APPROVED",
        payment_type: "PAY_NOW",
      });
    } catch {
      console.log("Couldnt update ticket payment staus");
      return new Error("Couldnt update ticket payment staus");
    }
  } catch (err) {
    console.log("Couldnt retrieve tickets for payment status");
    return Error("Couldnt retrieve tickets");
  }
};

// ✅ Fetch tickets by trip ID
export const fetchTicketsByTrip = async (tripId: number) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("trip", tripId),
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching tickets by trip ID:", error);
    return [];
  }
};

// ✅ Create a ticket
export const createTicket = async (ticketData: NewTicket) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      ticketData
    );
    console.log("Ticket Created:", response);
    return response;
  } catch (error) {
    console.error("Error creating ticket:", error);
  }
};

// ✅ Update a ticket (e.g., change payment status)
export const updateTicket = async (
  ticketId: string,
  ticketData: Partial<Ticket>
) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ticketId,
      ticketData
    );
  } catch (error) {
    console.error("Error updating ticket:", error);
    return null;
  }
};

// ✅ Delete a ticket
export const deleteTicket = async (ticketId: string) => {
  try {
    return await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, ticketId);
  } catch (error) {
    console.error("Error deleting ticket:", error);
  }
};
