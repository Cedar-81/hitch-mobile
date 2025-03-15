import { io } from "socket.io-client";

export const socketConnection = async () => {
  try {
    const socket = io("process.env.NEXT_PUBLIC_API_SOCKET");
    console.log("Socket connection established");
    return socket;
  } catch (error) {
    console.error("Error creating socket connection:", error);
  }
};
