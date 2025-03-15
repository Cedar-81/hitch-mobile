import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Linking,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "@/costants/colors";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { payViaRedirect } from "@/lib/apiServices/payViaRequest";
import { getPaymentStatus, payViaCode } from "@/lib/apiServices/payViaCode";
import QRCode from "react-native-qrcode-svg";
import QRCodeTerminal from "qrcode-terminal";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PaymentType } from "@/lib/types";
import { createTicket } from "@/lib/apiServices/ticketService";
import Modal from "react-native-modal";
import {
  ModalStatus,
  closeModal,
  updateModal,
} from "@/redux/slices/modalSlice";
import HitchModal from "@/components/HitchModal";
import { socketConnection } from "@/lib/socketHandlers";

const Payment = () => {
  const router = useRouter();
  const [useBarCode, setUseBarCode] = useState(false);
  const [useShortCode, setUseShortCode] = useState(false);
  const [showRedirectButton, setShowRedirectButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string>("");
  const [emvContent, setEmvContent] = useState<string | null>(null);
  const trip = useSelector((state: RootState) => state.trip);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  // Store the last modal state
  const lastModalState = useRef(null);

  console.log("creator vs id: ", trip.creator, user?.$id);

  const handlePayment = async () => {
    if (trip.price) {
      try {
        setIsLoading(true);

        // Notify the server to reset old transaction data
        await fetch("https://bluecode-backend.onrender.com/start-transaction", {
          method: "POST",
        });

        const result = await payViaRedirect({
          username: "MAJESTY",
          password: "80241e69-c052-45ae-bbac-0e23eaf0990a",
          amount: trip.price * 100,
        });

        setIsLoading(false);
        setShowRedirectButton(true);
        setRedirectUrl(result.payment.checkin_code);
        setEmvContent(result.payment.emv_content);

        console.log("Transaction Result:", result.payment.emv_content);
        console.log("Scan this QR code:");
        emvContent && QRCodeTerminal.generate(emvContent, { small: true });

        // Start polling
        pollTransactionStatus();
      } catch (err) {
        setIsLoading(false);
        console.log("Error in Transaction:", err);
      }
    }
  };

  // Poll transaction status
  const pollTransactionStatus = async () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          "https://bluecode-backend.onrender.com/transaction-status"
        );
        const data = await response.json();

        if (data.state === "APPROVED") {
          clearInterval(interval); // Stop polling
          console.log("✅ Payment Approved!");
          // Perform any follow-up actions (e.g., generate ticket)
          await handleCreateTicket(PaymentType.PAY_NOW, false);
          setEmvContent(null);
        } else if (data.state === "FAILED" || data.state === "CANCELLED") {
          clearInterval(interval); // Stop polling
          console.log("❌ Payment Failed or Cancelled!");
          dispatch(
            updateModal({
              title: "❌ Payment Failed!",
              text: "Please generate a new QRCode and try again",
              active: true,
              link: "/(root)/your_rides",
            })
          );
          setEmvContent(null);
        } else if (data.state === "CONFIRMATION") {
          console.log("⏳ Awaiting payment confirmation...");

          // 🔹 Only update modal if it's not already showing "Awaiting payment confirmation..."
          if (lastModalState.current !== "CONFIRMATION") {
            dispatch(
              updateModal({
                title: "Awaiting payment confirmation...",
                text: "Your payment is being processed. Please wait...",
                active: true,
                status: ModalStatus.GRAY,
              })
            );
            //@ts-ignore
            lastModalState.current = "CONFIRMATION"; // Store last state
          }
        } else {
          console.log("⌛ Waiting for payment approval...");
        }
      } catch (error) {
        console.error("Error fetching transaction status:", error);
      }
    }, 5000); // Poll every 5 seconds
  };

  const handleCreateTicket = async (
    payment_type: PaymentType,
    checkTicketOwner: boolean
  ) => {
    setIsLoading(true);
    console.log("creator: ", trip.creator);
    if (trip.trip_id && user?.$id && trip.creator) {
      console.log("in here");
      if (
        checkTicketOwner && //Prevent check when generating qr code
        trip.creator.toString() == user.$id
      ) {
        dispatch(
          updateModal({
            title: "Sorry you cannot purchase tickets to your own trip",
            active: true,
            status: ModalStatus.GRAY,
          })
        );
        setIsLoading(false);
        return;
      }
      try {
        const response = await createTicket({
          trip: trip.trip_id,
          users: user.$id,
          payment_status:
            payment_type == PaymentType.PAY_LATER ? "ONHOLD" : "APPROVED",
          payment_type: payment_type,
        });
        console.log("\nresponse: ", response);
        dispatch(
          updateModal({
            title: PaymentType.PAY_LATER
              ? "Ticket booked successfully"
              : "Payment Successful. Ticket booked.",
            link: "/(root)/(tabs)",
            active: true,
            text: undefined,
            status: ModalStatus.SUCCESS,
          })
        );
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        dispatch(
          updateModal({
            title: "Couldn't book your ticket",
            active: true,
            status: ModalStatus.FAILURE,
          })
        );
        console.log("\nAn error occured while trying to create ticket: ", err);
      }
    }
  };

  const [transaction, setTransaction] = useState(null);

  // useEffect(() => {
  //   const socketConn = async () => {
  //     return await socketConnection()
  //   }

  //   let socket = socketConn()

  //   const handleTransactionUpdate = (data: any) => {
  //     console.log("Received transaction update:", data);
  //     setTransaction(data);
  //   };

  //   socket.on("transaction_update", handleTransactionUpdate);
  //   socket.on("error", (data) => console.log("error: ", data));

  //   return () => {
  //     socket.off("transaction_update", handleTransactionUpdate); // Removes the event listener
  //     socket.disconnect(); // Disconnects the socket
  //   };
  // }, []);

  const openExternalURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const pollPaymentStatus = async (
    merchantTxId: string,
    maxRetries = 12,
    delay = 5000
  ) => {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`🔄 Checking payment status... (Attempt ${retries + 1})`);

        const data = await getPaymentStatus({
          username: "MAJESTY",
          password: "80241e69-c052-45ae-bbac-0e23eaf0990a",
          merchant_id: merchantTxId,
        });

        console.log("💳 Payment Status Result:", data);

        // ✅ Extract status based on response structure
        let status: string | undefined;
        let state: string | undefined;

        if ("payment" in data) {
          status = data.payment.state; // When response contains `payment`
        } else if ("status" in data) {
          status = data.result; // When response is `PROCESSING`
        }

        if (status === "APPROVED") {
          console.log("✅ Payment Approved!");
          dispatch(
            updateModal({
              title: "Payment Successful",
              text: "Your payment has been approved!",
              active: true,
              status: ModalStatus.SUCCESS,
            })
          );
          await handleCreateTicket(PaymentType.PAY_NOW, false);
          return;
        }

        if (status === "PROCESSING" || status === "CONFIRMATION") {
          console.log("⏳ Awaiting payment confirmation...");

          if (lastModalState.current !== "CONFIRMATION") {
            dispatch(
              updateModal({
                title: "Awaiting payment confirmation...",
                text: "Your payment is being processed. Please wait...",
                active: true,
                status: ModalStatus.GRAY,
              })
            );
            //@ts-ignore
            lastModalState.current = "CONFIRMATION";
          }
        }

        if (status === "FAILED") {
          console.log("❌ Payment Failed!");
          dispatch(
            updateModal({
              title: "Payment Failed",
              text: "Your payment could not be processed.",
              active: true,
              status: ModalStatus.FAILURE,
            })
          );
          return;
        }

        console.log("⏳ Payment still processing...");
        retries++;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        console.log("⚠️ Error fetching payment status:", error);
        dispatch(
          updateModal({
            title: "Payment Status Error",
            text: "There was an issue checking your payment status.",
            active: true,
            status: ModalStatus.FAILURE,
          })
        );
        return;
      }
    }

    console.log("⏰ Payment polling timeout reached.");
    dispatch(
      updateModal({
        title: "Payment Timeout",
        text: "Your payment is still processing. Please check again later.",
        active: true,
        status: ModalStatus.FAILURE,
      })
    );
  };

  const handleShortCodePayment = async (checkTicketOwner: boolean) => {
    if (
      checkTicketOwner &&
      trip.creator &&
      user &&
      trip.creator.toString() === user.$id
    ) {
      dispatch(
        updateModal({
          title: "Sorry, you cannot purchase tickets for your own trip.",
          active: true,
          status: ModalStatus.GRAY,
        })
      );
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      if (barcode.trim().length !== 0 && trip.price) {
        const paymentResult = await payViaCode({
          username: "MAJESTY",
          password: "80241e69-c052-45ae-bbac-0e23eaf0990a",
          amount: trip.price * 100,
          barcode: barcode ?? "",
        });

        console.log("🛒 Transaction Details:", paymentResult);
        setIsLoading(false);
        setBarcode("");

        //@ts-ignore
        const merchantTxId = paymentResult?.status?.merchant_tx_id;
        console.log("\n\nMerchant Transaction ID:", merchantTxId);

        console.log("\n\n🚀 Starting status polling...");
        //@ts-ignore
        await pollPaymentStatus(merchantTxId);
      }
    } catch (err) {
      setIsLoading(false);
      dispatch(
        updateModal({
          title: "Payment Unsuccessful",
          active: true,
          status: ModalStatus.FAILURE,
        })
      );
      console.log("⚠️ Error in Transaction:", err);
    }
  };

  if (isLoading)
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </SafeAreaView>
    );

  return (
    <ScrollView style={{ marginBottom: 16 }}>
      <View
        style={{
          backgroundColor: COLORS.gray,
          paddingHorizontal: 16,
          position: "relative",
        }}
      >
        <TouchableOpacity
          style={{ position: "absolute", left: 20, top: 20 }}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            height: 300,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Rubik-Medium",
              fontSize: 14,
              textAlign: "center",
              color: COLORS.black,
            }}
          >
            Trip: #{trip.trip_id}
          </Text>
          <Text
            style={{
              fontFamily: "Rubik-Medium",
              fontSize: 40,
              textAlign: "center",
              color: COLORS.primary,
            }}
          >
            N{trip.price}.00
          </Text>
          <Text
            style={{
              fontFamily: "Rubik-Medium",
              fontSize: 14,
              textAlign: "center",
              color: COLORS.black,
            }}
          >
            Pay with Bluecode
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 15, marginTop: 30 }}>
        <Text
          style={{
            fontFamily: "Rubik-Medium",
            fontSize: 20,
            color: COLORS.black,
          }}
        >
          {trip.paymentType == PaymentType.PAY_NOW
            ? "Select a payment method"
            : "Recieve payment for your trip"}
        </Text>
        {trip.paymentType == PaymentType.PAY_LATER && (
          <TouchableOpacity
            disabled={emvContent && emvContent.trim() != "" ? true : false}
            onPress={handlePayment}
            style={{
              gap: 4,
              padding: 15,
              borderWidth: 1,
              borderColor: COLORS.gray,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Rubik-Medium",
                fontSize: 20,
                color: COLORS.black,
              }}
            >
              Use QR Code
            </Text>
            <Text
              style={{
                fontFamily: "Rubik",
                fontSize: 14,
                color: COLORS.black,
              }}
            >
              This QR code should be scanned by rider in their Bluecode
              application to complete payment
            </Text>
            {emvContent && emvContent.trim() != "" && (
              <View
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <QRCode value={emvContent} size={200} />
              </View>
            )}
          </TouchableOpacity>
        )}
        {trip.paymentType == PaymentType.PAY_NOW && (
          <TouchableOpacity
            onPress={() => setUseBarCode(true)}
            style={{
              gap: 4,
              padding: 15,
              borderWidth: 1,
              borderColor: COLORS.gray,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Rubik-Medium",
                fontSize: 20,
                color: COLORS.black,
              }}
            >
              Pay Now using shortcode
            </Text>
            <Text
              style={{
                fontFamily: "Rubik",
                fontSize: 14,
                color: COLORS.black,
              }}
            >
              To retrieve you code open your Bluecode app and click on the
              barcode at the top of the screen, some numbers will appear. Copy
              the numbers and input in the input field below and pay
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 10,
              }}
            >
              <TextInput
                placeholder="enter barcode/shortcode"
                style={styles.input}
                value={barcode}
                keyboardType="number-pad"
                onChangeText={(text) => setBarcode(text)}
              />

              <TouchableOpacity
                onPress={() => handleShortCodePayment(true)}
                disabled={isLoading}
                style={{
                  ...styles.button,
                  backgroundColor:
                    isLoading || barcode.length == 0
                      ? COLORS.gray
                      : COLORS.primary,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Rubik",
                    fontSize: 14,
                    color: COLORS.white,
                  }}
                >
                  Pay
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        {trip.paymentType == PaymentType.PAY_NOW && (
          <TouchableOpacity
            onPress={async () =>
              await handleCreateTicket(PaymentType.PAY_LATER, true)
            }
            style={{
              gap: 4,
              padding: 15,
              borderWidth: 1,
              borderColor: COLORS.gray,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Rubik-Medium",
                fontSize: 20,
                color: COLORS.black,
              }}
            >
              Pay Later
            </Text>
            <Text
              style={{
                fontFamily: "Rubik",
                fontSize: 14,
                color: COLORS.black,
              }}
            >
              With this feature you can easily make payments when you have
              arrived at your destination or physically in person with your
              ride.
            </Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          style={{
            gap: 4,
            padding: 15,
            borderWidth: 1,
            borderColor: COLORS.gray,
            borderRadius: 20,
          }}
          onPress={() => setUseShortCode(true)}
        >
          <Text
            style={{
              fontFamily: "Rubik-Medium",
              fontSize: 20,
              color: COLORS.black,
            }}
          >
            Use Shortcode
          </Text>
          <Text
            style={{
              fontFamily: "Rubik",
              fontSize: 14,
              color: COLORS.black,
            }}
          >
            Retrieve shortcode from your Bluecode app and use it to make payment
          </Text>
          {useShortCode && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 10,
              }}
            >
              <TextInput placeholder="enter shortcode" style={styles.input} />
              <TouchableOpacity style={styles.button}>
                <Text
                  style={{
                    fontFamily: "Rubik",
                    fontSize: 14,
                    color: COLORS.white,
                  }}
                >
                  Pay
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: "Rubik",
    fontSize: 13,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: COLORS.gray,
    flex: 1,
  },

  button: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    paddingHorizontal: 25,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default Payment;
