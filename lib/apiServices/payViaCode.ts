import axios from "axios";
import base64 from "react-native-base64";
import { nanoid } from "nanoid";
import uuid from "react-native-uuid";

// API Constants
const API_URL = "https://merchant-api.acq.int.bluecode.ng/v4/payment";

// Define types for request and response
interface CodePaymentRequest {
  username: string;
  password: string;
  amount: number;
  barcode: string;
}

interface PaymentResponse {
  result: string;
  payment: {
    scheme: string;
    state: string;
    currency: string;
    total_amount: number;
    acquirer_tx_id: string;
    merchant_tx_id: string;
    requested_amount: number;
    merchant_callback_url: string | null;
    slip_note: string;
    consumer_tip_amount: number;
    end_to_end_id: string | null;
  };
}

// Generate Basic Auth Token
const getAuthToken = (username: string, password: string): string => {
  return `Basic ${base64.encode(`${username}:${password}`)}`;
};

// Generate unique slip & terminal IDs
const generateUniqueId = (): string => uuid.v4() as string;

// Function to process payment via barcode/QR
export const payViaCode = async ({
  username,
  password,
  amount,
  barcode,
}: CodePaymentRequest): Promise<PaymentResponse> => {
  try {
    const token = getAuthToken(username, password);

    const response = await axios.post<PaymentResponse>(
      API_URL,
      {
        branch_ext_id: "MAJESTY",
        merchant_tx_id: generateUniqueId(),
        barcode: barcode,
        requested_amount: amount,
        currency: "NGN",
        slip: generateUniqueId(),
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

    console.log("my response: ", response);

    console.log("✅ Payment Successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Payment Failed:", error);
    //@ts-ignore
    throw new Error(error || "Payment request failed");
  }
};
