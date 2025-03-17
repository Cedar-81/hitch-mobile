import { View, Text, Image, TouchableOpacity, Button } from "react-native";
import React from "react";
import { COLORS } from "@/costants/colors";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PaymentType, Trip } from "@/lib/types";
import { formatTripTime } from "@/lib/helpers";
import { useDispatch, useSelector } from "react-redux";
import { updateTripState } from "@/redux/slices/tripSlice";
import { RootState } from "@/redux/store";

const TransportCard = ({ trip }: { trip: Trip }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const formattedTimestamp =
    trip && formatTripTime(trip.start_date_time, trip.end_date_time);
  if (!trip || !trip.users) return <Text>Loading...</Text>;
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
              trip.users && trip.users.image
                ? { uri: trip.users.image }
                : require("../assets/images/avatar.png")
            }
            alt="avatar"
            style={{ height: 25, width: 25, borderRadius: 1000 }}
          />
          <Text style={{ fontFamily: "Rubik-Medium", fontSize: 16 }}>
            {`${trip.users.firstname} ${trip.users.lastname[0]}.`}
          </Text>
        </View>

        <Text style={{ fontFamily: "Rubik-Bold", fontSize: 20 }}>
          ₦{trip.price}
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
            {trip.start_location_state}
          </Text>
          <Text style={{ fontFamily: "Rubik", fontSize: 10 }}>
            {trip.start_location_city}
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
            {trip.destination_location_state}
          </Text>
          <Text style={{ fontFamily: "Rubik", fontSize: 10 }}>
            {trip.destination_location_city}
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
            {trip.car_type}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <FontAwesome6 name="people-group" size={10} color={COLORS.primary} />
          <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
            {trip.passenger_count} passengers
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <FontAwesome name="star" size={10} color={COLORS.primary} />
          <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
            5 stars
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          paddingVertical: 8,
          backgroundColor:
            trip.users.$id == user?.$id ? COLORS.gray : COLORS.primary,
          marginTop: 20,
          borderRadius: 100,
        }}
        disabled={trip.users.$id == user?.$id}
        onPress={() => {
          dispatch(
            updateTripState({
              paymentType: PaymentType.PAY_NOW,
              trip_id: trip.$id,
              price: trip.price,
              creator: trip.users.$id,
            })
          );
          router.push("/(root)/payment");
        }}
      >
        <Text
          style={{
            fontFamily: "Rubik-Medium",
            fontSize: 14,
            textAlign: "center",
            color: COLORS.white,
          }}
        >
          Book Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransportCard;
