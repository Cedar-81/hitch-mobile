import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "@/costants/colors";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const NewTripHeader = () => {
  const router = useRouter();
  const { last_route } = useSelector(
    (state: RootState) => state.create_trip_steps
  );
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
        marginTop: 20,
        gap: 16,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          //@ts-ignore
          router.push(last_route);
        }}
      >
        <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: "Rubik-Bold",
          fontSize: 30,
          color: COLORS.primary,

          // marginBottom: 20,
        }}
      >
        Create a trip
      </Text>
    </View>
  );
};

export default NewTripHeader;
