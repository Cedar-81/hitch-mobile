import { View, Text, Image } from "react-native";
import React from "react";
import StepIndicator from "./StepIndicator";
import { COLORS } from "@/costants/colors";

const NewTripFormHeader = () => {
  return (
    <View>
      <Image
        source={require("../assets/images/home_bg.png")}
        style={{ height: 120, width: "100%" }}
      />

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <StepIndicator />
      </View>
    </View>
  );
};

export default NewTripFormHeader;
