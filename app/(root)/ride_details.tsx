import { View, Text, Image } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/costants/colors";
import Search from "@/components/Search";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

const RideDetails = () => {
  return (
    <View>
      <View>
        <Image
          source={require("../../assets/images/home_bg.png")}
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
              borderWidth: 1,
              borderColor: COLORS.black300,
              borderRadius: 15,
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: "4" }}
              >
                <Image
                  source={require("../../assets/images/avatar.png")}
                  alt="avatar"
                  style={{ height: 25, width: 25, borderRadius: 1000 }}
                />
                <Text style={{ fontFamily: "Rubik-Medium", fontSize: 16 }}>
                  Divinewisdom U.
                </Text>
              </View>

              <Text style={{ fontFamily: "Rubik-Bold", fontSize: 20 }}>
                ₦5000
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
                gap: 5,
              }}
            >
              <View>
                <Text style={{ fontFamily: "Rubik-Bold", fontSize: 20 }}>
                  8:00 AM
                </Text>
                <Text style={{ fontFamily: "Rubik-Bold", fontSize: 16 }}>
                  Enugu
                </Text>
                <Text style={{ fontFamily: "Rubik", fontSize: 10 }}>
                  Trans-ekulu
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    height: 1,
                    minWidth: 20,
                    width: "auto",
                    backgroundColor: "#ccc",
                    marginVertical: 10,
                  }}
                />
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.black300,
                    borderRadius: 1000,
                    height: 25,
                    width: 55,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontFamily: "Rubik", fontSize: 10 }}>
                    1h 20m
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    minWidth: 20,
                    width: "auto",
                    backgroundColor: "#ccc",
                    marginVertical: 10,
                  }}
                />
              </View>
              <View>
                <Text style={{ fontFamily: "Rubik-Bold", fontSize: 20 }}>
                  10:38 PM
                </Text>
                <Text style={{ fontFamily: "Rubik-Bold", fontSize: 16 }}>
                  Abuja
                </Text>
                <Text style={{ fontFamily: "Rubik", fontSize: 10 }}>
                  Gwagwalada
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <FontAwesome5 name="car" size={10} color={COLORS.primary} />
                <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
                  Audi
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <FontAwesome6
                  name="people-group"
                  size={10}
                  color={COLORS.primary}
                />
                <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
                  4 passengers
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <FontAwesome name="star" size={10} color={COLORS.primary} />
                <Text style={{ fontFamily: "Rubik-Medium", fontSize: 10 }}>
                  5 stars
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default RideDetails;
