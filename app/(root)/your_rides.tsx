import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/costants/colors";
import { useRouter } from "expo-router";
import TransportCard from "@/components/TransportCard";
import TicketCard from "@/components/TicketCard";
import { fetchTripsByUser } from "@/lib/apiServices/tripsService";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import YourRidesTripCard from "@/components/YourRidesTripCard";
import { Trip } from "@/lib/types";

const YourBookings = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const getUserTrips = async () => {
    if (!user) return; // Prevent running if no userId
    setLoading(true);
    const userTrips = await fetchTripsByUser(user.$id);
    setTrips((userTrips as unknown) as Trip[]);
    setLoading(false);
  };

  useEffect(() => {
    getUserTrips();
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Start refreshing
    await getUserTrips(); // Refetch data
    setRefreshing(false); // Stop refreshing
  }, []);

  if (loading)
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </SafeAreaView>
    );

  return (
    <FlatList
      data={trips}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <YourRidesTripCard trip={item} />
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: "70%",
            paddingHorizontal: 40,
          }}
        >
          <Text
            style={{
              fontFamily: "Rubik-Bold",
              textAlign: "center",
              fontSize: 18,
              color: COLORS.primary90,
            }}
          >
            Looks like you haven't created any trips yet.
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 120 }}
      //   ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      ListHeaderComponent={
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 36,
            backgroundColor: COLORS.primary,
            zIndex: 10, // Ensure it's above other elements
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontFamily: "Rubik-Bold",
                textAlign: "center",
                fontSize: 20,
                color: COLORS.white,
              }}
            >
              Your Rides
            </Text>
            {/* <Text
                style={{
                  fontFamily: "Rubik",
                  textAlign: "center",
                  fontSize: 12,
                  color: COLORS.gray,
                }}
              >
                November 6, 2025
              </Text> */}
          </View>
          <View />
        </View>
      }
      stickyHeaderIndices={[0]} // 🚀 Makes the header sticky
    />
  );
};

export default YourBookings;
