import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import AuthProvider from "@/context/AuthProvider";
import HitchModal from "@/components/HitchModal";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Rubik: require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Semibold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      //hide splash screen
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="rides" />
          <Stack.Screen name="ride_details" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="payment" />
          <Stack.Screen name="your_rides" />
        </Stack>
      </AuthProvider>
      <HitchModal />
    </Provider>
  );
}
