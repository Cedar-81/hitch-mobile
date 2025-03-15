import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import TransportCard from "@/components/TransportCard";
import Search from "@/components/Search";
import { COLORS } from "@/costants/colors";
import { fetchTrips } from "@/lib/apiServices/tripsService";
import { Trip, User } from "@/lib/types";
import { FetchUserByEmail } from "@/lib/apiServices/usersService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateUser } from "@/redux/slices/api/authSlice";

const Rides = () => {
  const [trips, setTrips] = useState<Trip[]>([]);

  const { session, loading, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      if (!user && session && session.$id) {
        const data = await FetchUserByEmail(session.email);
        dispatch(updateUser(data as User));

        console.log("\n\nuser: ", data);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadTrips = async () => {
      const data = await fetchTrips();
      data && setTrips((data as unknown) as Trip[]);
    };
    loadTrips();
  }, []);

  if (loading || !trips || (trips && trips.length == 0))
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
      contentContainerStyle={{
        paddingBottom: 120,
        backgroundColor: COLORS.white,
      }}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <TransportCard trip={item} />
        </View>
      )}
      ListHeaderComponent={
        <View>
          <Image
            source={
              user && user.image
                ? { uri: user.image }
                : require("../../../assets/images/home_bg.png")
            }
            style={{ height: 120, width: "100%", position: "absolute" }}
          />
          <LinearGradient
            colors={["#FFFFFF00", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.2 }}
            style={{
              paddingBottom: 20,
              paddingTop: 100,
            }}
          >
            <View
              style={{
                paddingHorizontal: 20,
                flexDirection: "column",
                rowGap: 40 /* ✅ Fix: Changed "40" to number 40 */,
              }}
            >
              <Search />
              <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                <Text
                  style={{
                    fontFamily: "Rubik-Bold",
                    fontSize: 20,
                    color: COLORS.primary,
                    // marginBottom: 20,
                  }}
                >
                  Available Rides
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      }
    />
  );
};

export default Rides;
