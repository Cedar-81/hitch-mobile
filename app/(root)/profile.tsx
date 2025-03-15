import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useMemo, useRef } from "react";
import { COLORS } from "@/costants/colors";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { signout } from "@/redux/slices/api/authSlice";

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={
            user && user.image
              ? { uri: user.image }
              : require("../../assets/images/avatar.png")
          }
          alt="avatar"
          resizeMode="cover"
          style={{
            height: 100,
            width: 100,
            borderRadius: 1000,
            borderWidth: 2,
            borderColor: COLORS.secondary,
          }}
        />
        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 23,
            fontFamily: "Rubik-Medium",
          }}
        >
          {`${user?.firstname} ${user?.lastname}`}
        </Text>
      </View>

      <View style={{ marginTop: 30, gap: 13 }}>
        <TouchableOpacity
          onPress={() => router.push("/(root)/your_rides")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            backgroundColor: COLORS.secondary20,
            paddingHorizontal: 15,
            borderRadius: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome5 name="car-side" size={18} color="black" />
            <Text
              style={{
                fontFamily: "Rubik-Medium",
                fontSize: 16,
                color: COLORS.primary,
                paddingVertical: 15,
                // marginBottom: 20,
              }}
            >
              Your rides
            </Text>
          </View>
          <AntDesign name="right" size={18} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            backgroundColor: COLORS.secondary20,
            paddingHorizontal: 15,
            borderRadius: 16,
          }}
          onPress={() => router.push("/(root)/(tabs)/tickets")}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons name="checkbook" size={22} color="black" />
            <Text
              style={{
                fontFamily: "Rubik-Medium",
                fontSize: 16,
                color: COLORS.primary,
                paddingVertical: 15,
                // marginBottom: 20,
              }}
            >
              Your bookings
            </Text>
          </View>
          <AntDesign name="right" size={18} color="black" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            backgroundColor: COLORS.secondary20,
            paddingHorizontal: 15,
            borderRadius: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome name="cc-mastercard" size={18} color="black" />
            <Text
              style={{
                fontFamily: "Rubik-Medium",
                fontSize: 16,
                color: COLORS.primary,
                paddingVertical: 15,
                // marginBottom: 20,
              }}
            >
              Your income account
            </Text>
          </View>
          <AntDesign name="right" size={18} color="black" />
        </View>
        <TouchableOpacity onPress={() => dispatch(signout())}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              backgroundColor: COLORS.secondary20,
              paddingHorizontal: 15,
              borderRadius: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <AntDesign name="logout" size={18} color="black" />
              <Text
                style={{
                  fontFamily: "Rubik-Medium",
                  fontSize: 16,
                  color: COLORS.primary,
                  paddingVertical: 15,
                  // marginBottom: 20,
                }}
              >
                Logout
              </Text>
            </View>
            <AntDesign name="right" size={18} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
