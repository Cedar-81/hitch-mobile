import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/costants/colors";
import StepIndicator from "@/components/StepIndicator";
import { Stack } from "expo-router";

const Create = () => {
  const steps = [
    { id: 1, state: "completed" },
    { id: 2, state: "completed" },
    { id: 3, state: "current" },
    { id: 4, state: "untouched" },
    { id: 5, state: "untouched" },
  ];
  return (
    <SafeAreaView style={{ paddingHorizontal: 16 }}>
      <Text>Create</Text>
      {/* <View>
        <Text
          style={{
            fontFamily: "Rubik-Bold",
            fontSize: 20,
            color: COLORS.primary,
            padding: 16,
            // marginBottom: 20,
          }}
        >
          Create a trip
        </Text>
        <View
          style={{
            borderRadius: 30,
            overflow: "hidden",
          }}
        >
          <Image
            source={require("../../../assets/images/home_bg.png")}
            style={{ height: 120, width: "100%" }}
          />

          <StepIndicator />
      
        </View>
      </View> */}
    </SafeAreaView>
  );
};

export default Create;
