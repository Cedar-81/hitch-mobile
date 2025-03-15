import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/costants/colors";
import { useRouter } from "expo-router";
import TransportCard from "@/components/TransportCard";

const Rides = () => {
  const router = useRouter();
  return (
    <FlatList
      data={[1, 2, 3, 4, 5]}
      keyExtractor={(item) => item.toString()}
      renderItem={(item) => (
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <TransportCard trip={undefined} />
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 40 }}
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
              Manchester to Paris
            </Text>
            <Text
              style={{
                fontFamily: "Rubik",
                textAlign: "center",
                fontSize: 12,
                color: COLORS.gray,
              }}
            >
              November 6, 2025
            </Text>
          </View>
          <View />
        </View>
      }
      stickyHeaderIndices={[0]} // 🚀 Makes the header sticky
    />
  );
};

export default Rides;
