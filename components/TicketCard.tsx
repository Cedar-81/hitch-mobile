import { View, Text, Image, TouchableOpacity, Button } from "react-native";
import React from "react";
import { COLORS } from "@/costants/colors";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Ticket } from "@/lib/types";
import { formatTripTime } from "@/lib/helpers";

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const router = useRouter();
  const formattedTimestamp =
    ticket.trip &&
    formatTripTime(ticket.trip.start_date_time, ticket.trip.end_date_time);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: COLORS.black300,
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
                borderColor: COLORS.black300,
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
    </View>
  );
};

export default TicketCard;
