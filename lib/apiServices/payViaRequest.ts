import axios from "axios";
import base64 from "react-native-base64";
import uuid from "react-native-uuid";

// Define API Constants
const API_URL = "https://merchant-api.acq.int.bluecode.ng/v4/register";

// Define types for parameters and response
interface PaymentRequest {
  username: string;
  password: string;
  amount: number;
}

interface PaymentResponse {
  transaction_id: string;
  status: string;
  message: string;
  [key: string]: any; // In case API returns additional fields
}

// Function to generate the Authorization token dynamically
const getAuthToken = (username: string, password: string): string => {
  return `Basic ${base64.encode(`${username}:${password}`)}`;
};

const generateUniqueId = (): string => uuid.v4() as string;

// Payment service function for Redirect
export const payViaRedirect = async ({
  username,
  password,
  amount,
}: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const token = getAuthToken(username, password);
    console.log(
      "username, pass, amount: ",
      username,
      password,
      amount,
      token,
      generateUniqueId()
    );

    const response = await axios.post<PaymentResponse>(
      API_URL,
      {
        timeout: 1800000,
        scheme: "blue_code",
        merchant_tx_id: generateUniqueId(),
        branch_ext_id: "MAJESTY",
        requested_amount: amount,
        source: "mcommerce",
        currency: "NGN",
        merchant_callback_url:
          "https://bluecode-backend.onrender.com/transaction-callback",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    console.log("Payment Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment Failed:", error);
    //@ts-ignore
    throw new Error(error ?? "Payment request failed");
  }
};
