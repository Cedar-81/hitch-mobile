import { View, Text, Image, TouchableOpacity, Button } from "react-native";
import React, { useState } from "react";
import { COLORS } from "@/costants/colors";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Ticket } from "@/lib/types";
import { formatTripTime, generateUniqueCode } from "@/lib/helpers";
import { useDispatch } from "react-redux";
import { updateModal } from "@/redux/slices/modalSlice";
import { updateTicket } from "@/lib/apiServices/ticketService";

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const [ticketCode, setTicketCode] = useState<number | null>(null);
  const [counter, setCounter] = useState(40);
  const router = useRouter();
  const dispatch = useDispatch();
  const formattedTimestamp =
    ticket.trip &&
    formatTripTime(ticket.trip.start_date_time, ticket.trip.end_date_time);

  // const startCountdown = (duration: number = 120) => {
  //   setCounter(duration); // Reset counter

  //   const interval = setInterval(() => {
  //     setCounter((prev) => {
  //       console.log(`⏳ Countdown: ${prev}s`);

  //       dispatch(updateModal({ text: String(prev) }));

  //       if (prev <= 1) {
  //         clearInterval(interval); // ✅ Stop the interval immediately
  //         console.log("✅ Countdown finished!");

  //         handleTicketExpiration(); // Run async logic separately
  //         return 0; // Ensure counter doesn't go negative
  //       }

  //       return prev - 1;
  //     });
  //   }, 1000);
  // };

  // // ✅ Separate async function
  // const handleTicketExpiration = async () => {
  //   if (ticket.$id) {
  //     setTicketCode(null);
  //     await updateTicket(ticket.$id, { code: null });

  //     dispatch(
  //       updateModal({
  //         active: true,
  //         title: "Code Expired", // ✅ Avoid stale `ticketCode`
  //         link: null,
  //         text: undefined,
  //       })
  //     );
  //   }
  // };

  // const generateTicketCode = async () => {
  //   if (!ticket.$id) return;

  //   const code = generateUniqueCode();
  //   setTicketCode(code);

  //   console.log("Generated Code:", code); // ✅ This will now correctly log the new code

  //   await updateTicket(ticket.$id, { code });

  //   dispatch(
  //     updateModal({
  //       active: true,
  //       title: String(code), // ✅ Use `code` instead of `ticketCode` to avoid async issues
  //       link: null,
  //       text: undefined,
  //     })
  //   );

  //   startCountdown();
  // };

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: COLORS.secondary,
        borderRadius: 15,
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: "4" }}>
          <Image
            source={
              ticket.trip.users && ticket.trip.users.image
                ? { uri: ticket.trip.users.image }
                : require("../assets/images/avatar.png")
            }
            alt="avatar"
            style={{ height: 25, width: 25, borderRadius: 1000 }}
          />
          <Text style={{ fontFamily: "Rubik-Medium", fontSize: 16 }}>
            {`${ticket.users.firstname} ${ticket.users.lastname[0]}.`}.
          </Text>
        </View>

        <Text style={{ fontFamily: "Rubik-Bold", fontSize: 20 }}>
          ₦{ticket.trip.price}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
          gap: 5,
        }}
      >
        <View>
          <Text style={{ fontFamily: "Rubik-Bold", fontSize: 20 }}>
            {formattedTimestamp.formattedStartTime}
          </Text>
          <Text style={{ fontFamily: "Rubik-Bold", fontSize: 16 }}>
            {ticket.trip.start_location_state}
          </Text>
          <Text style={{ fontFamily: "Rubik", fontSize: 10 }}>
            {ticket.trip.start_location_city}
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                height: 1,
                minWidth: 20,
                width: "auto",
                backgroundColor: "#ccc",
                marginVertical: 10,
              }}
            />
            <View
              style={{
                borderWidth: 1,
                borderColor: COLORS.secondary,
                borderRadius: 1000,
                height: 25,
                width: 55,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "Rubik", fontSize: 10 }}>
                {formattedTimestamp.duration}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                minWidth: 20,
                width: "auto",
                backgroundColor: "#ccc",
                marginVertical: 10,
              }}
            />
          </View>
          <Text
            style={{ fontFamily: "Rubik-Bold", fontSize: 10, marginTop: 5 }}
          >
            {formattedTimestamp.formattedStartDate}
          </Text>
        </View>
        <View>
          <Text style={{ fontFamily: "Rubik-Bold", fontSize: 20 }}>
            {formattedTimestamp.formattedEndTime}
          </Text>
          <Text style={{ fontFamily: "Rubik-Bold", fontSize: 16 }}>
            {ticket.trip.destination_location_state}
          </Text>
          <Text style={{ fontFamily: "Rubik", fontSize: 10 }}>
            {ticket.trip.destination_location_city}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <FontAwesome5 name="car" size={10} color={COLORS.primary} />
          <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
            {ticket.trip.car_type}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <FontAwesome6 name="people-group" size={10} color={COLORS.primary} />
          <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
            {ticket.trip.passenger_count} passengers
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <FontAwesome name="star" size={10} color={COLORS.primary} />
          <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
            5 stars
          </Text>
        </View>
      </View>

      {/* <View
        style={{
          flexDirection: "row",
          justifyContent:
            ticket.payment_type == "PAY_LATER" ? "space-between" : "center",
          paddingHorizontal: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 2,
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
            status:{" "}
          </Text>
          <Text
            style={{
              fontFamily: "Rubik-Medium",
              fontSize: 10,
              color:
                ticket.payment_type == "PAY_LATER"
                  ? COLORS.error
                  : COLORS.success,
            }}
          >
            {ticket.payment_type == "PAY_LATER" ? "incomplete" : "complete"}
          </Text>
        </View>
        {ticket.payment_type == "PAY_LATER" && (
          <View
            style={{
              flexDirection: "row",
              gap: 2,
              alignSelf: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
              code:{" "}
            </Text>
            <TouchableOpacity
              onPress={generateTicketCode}
              style={{
                borderRadius: 1000,
                backgroundColor: COLORS.secondary,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: "Rubik-Medium",
                  fontSize: 10,
                  color: COLORS.primary,
                }}
              >
                click generate ticket code
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View> */}
    </View>
  );
};

export default TicketCard;
