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
import { fetchTicketsByUser } from "@/lib/apiServices/ticketService";
import { Ticket } from "@/lib/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import uuid from "react-native-uuid";

const Rides = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const getUserTickets = async () => {
    if (!user) return; // Prevent running if no userId
    setLoading(true);
    const userTickets = await fetchTicketsByUser(user.$id);
    console.log("\nuser tickets: ", userTickets);
    setTickets((userTickets as unknown) as Ticket[]);
    setLoading(false);
  };

  useEffect(() => {
    getUserTickets();
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Start refreshing
    await getUserTickets(); // Refetch data
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
      data={tickets}
      keyExtractor={(item) => uuid.v4()}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <TicketCard ticket={item} />
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
            Looks like you haven't booked any trips yet.
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
              Purchased Tickets
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

export default Rides;
