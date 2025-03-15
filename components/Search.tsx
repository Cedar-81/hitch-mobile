import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "@/costants/colors";
import { Ionicons, Octicons } from "@expo/vector-icons";
import HomeTopNav from "./HomeTopNav";
import { useRouter } from "expo-router";

const Search = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
      );
      const data = await response.json();
      console.log("\nPlaces Data: ", data);
      setResults(data);
    } else {
      setResults([]);
    }
  };
  return (
    <View>
      <HomeTopNav />

      <View style={{ ...styles.inputsContainer }}>
        <Text style={{ fontFamily: "Rubik-Semibold", fontSize: 16 }}>
          One way
        </Text>
        <View style={{ ...styles.inputContainer }}>
          <Ionicons name="locate" size={24} color="#00000060" />
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            onChangeText={(text) => handleSearch(text)}
            style={{ ...styles.text }}
            placeholder="Current Location"
          />
        </View>

        <View style={{ ...styles.inputContainer }}>
          <Octicons name="location" size={24} color="#00000060" />
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            style={{ ...styles.text }}
            placeholder="Travel Location"
          />
        </View>

        <View style={{ ...styles.inputContainer }}>
          <Octicons name="calendar" size={24} color="#00000060" />
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            style={{ ...styles.text }}
            placeholder="Travel Date"
          />
        </View>

        <TouchableOpacity
          style={{ ...styles.searchButton, backgroundColor: COLORS.gray }}
          onPress={() => router.push("/(root)/rides")}
          disabled={true}
        >
          <Text style={{ ...styles.text_md, color: COLORS.white }}>
            Search coming soon...
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputsContainer: {
    flexDirection: "column",
    gap: 10,
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: COLORS.black300,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.black300,
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 2,
    gap: 10,
  },
  searchButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    marginTop: 10,
  },
  text: {
    fontFamily: "Rubik",
  },
  text_md: {
    fontFamily: "Rubik-Medium",
  },
});

export default Search;
