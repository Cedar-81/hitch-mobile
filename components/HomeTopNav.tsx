import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "@/costants/colors";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const HomeTopNav = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <View
      style={{
        paddingTop: 40,
        paddingBottom: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={require("../assets/images/logo2.png")}
            alt="hitch logo"
            style={{ height: 25, width: 30 }}
          />
          <Text
            style={{
              fontFamily: "Rubik-Bold",
              fontSize: 20,
              color: COLORS.primary,
            }}
          >
            Hitch
          </Text>
        </View>
        <Text
          style={{
            fontSize: 12,
            marginTop: 2,
            fontFamily: "Rubik",
            color: "#00000080",
          }}
        >
          Hitch your next destination.
        </Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/profile")}>
        <Image
          source={
            user && user.image
              ? { uri: user.image }
              : require("../assets/images/avatar.png")
          }
          alt="avatar"
          style={{
            height: 40,
            width: 40,
            borderRadius: 1000,
            borderWidth: 2,
            borderColor: COLORS.secondary,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeTopNav;
