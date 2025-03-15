import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/costants/colors";
import StepIndicator from "@/components/StepIndicator";
import { Stack } from "expo-router";

const Layout = () => {
  const steps = [
    { id: 1, state: "completed" },
    { id: 2, state: "completed" },
    { id: 3, state: "current" },
    { id: 4, state: "untouched" },
    { id: 5, state: "untouched" },
  ];
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step1" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
    </Stack>
  );
};

export default Layout;
