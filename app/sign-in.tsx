import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store"; // Ensure correct path
import { signin } from "@/redux/slices/api/authSlice";
import { COLORS } from "@/costants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { fromSignup } = useSelector((state: RootState) => state.auth_manager);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = () => {
    if (email && password) {
      dispatch(signin({ email, password }));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }} // Ensures content fills screen
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            padding: 20,
            paddingTop: 60,
            backgroundColor: COLORS.white,
            alignItems: "center",
            flexGrow: 1, // Ensures the View grows inside ScrollView
            minHeight: "100%", // Forces full height
          }}
        >
          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontFamily: "Rubik-Medium",
                fontSize: 40,
                color: COLORS.primary,
              }}
            >
              Welcome {!fromSignup && "back"},
            </Text>
            <Text
              style={{
                fontFamily: "Rubik",
                fontSize: 14,
                color: COLORS.primary,
              }}
            >
              Let's get you back in...
            </Text>
            {fromSignup && (
              <Text
                style={{
                  fontFamily: "Rubik-Medium",
                  fontSize: 14,
                  color: COLORS.primary,
                }}
              >
                Please do well to first verify your new account from your email
                before trying to login
              </Text>
            )}

            <Text
              style={{
                fontFamily: "Rubik",
                fontSize: 14,
                color: COLORS.primary,
                marginBottom: 5,
                marginLeft: 10,
                marginTop: 30,
              }}
            >
              Email
            </Text>

            <TextInput
              keyboardType="email-address"
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                paddingHorizontal: 20,
                marginBottom: 10,
                borderRadius: 1000,
                color: COLORS.primary,
                width: "100%",
                fontFamily: "Rubik",
              }}
            />

            <Text
              style={{
                fontFamily: "Rubik",
                fontSize: 14,
                color: COLORS.primary,
                marginBottom: 5,
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Password
            </Text>

            <View
              style={{
                position: "relative",
                width: "100%",
                alignItems: "center",
              }}
            >
              <TextInput
                keyboardType="default"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible} // Toggle visibility
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 10,
                  paddingRight: 40, // Space for icon
                  marginBottom: 10,
                  borderRadius: 1000,
                  width: "100%",
                  color: COLORS.primary,
                  paddingHorizontal: 20,
                  fontFamily: "Rubik",
                }}
              />

              {/* Toggle Password Visibility */}
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{
                  position: "absolute",
                  right: 19,
                  top: 19,
                  transform: [{ translateY: -10 }],
                }}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={20}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
            {error && (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            )}
          </View>

          {/* Button and Loading Spinner */}
          <View
            style={{
              width: "100%",
              marginTop: "auto",
              paddingBottom: 40,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading}
              style={{
                ...styles.button,
                backgroundColor: COLORS.secondary,
                borderRadius: 1000,
                width: "100%",
                alignItems: "center",
                height: 55,
                padding: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: "Rubik-Medium",
                  fontSize: 18,
                  color: COLORS.primary,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: "Rubik-Medium",
                fontSize: 18,
                marginVertical: 5,
                color: COLORS.darkGray,
              }}
            >
              ----OR----
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/sign-up")}
              disabled={loading}
              style={{
                ...styles.button,
                borderColor: COLORS.secondary,
                backgroundColor: COLORS.white,
                borderWidth: 2,
                borderRadius: 1000,
                width: "100%",
                alignItems: "center",
                height: 55,
                padding: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: "Rubik-Medium",
                  fontSize: 18,
                  color: COLORS.primary,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: "Rubik",
    fontSize: 13,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: COLORS.gray,
    flex: 1,
  },

  button: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    paddingHorizontal: 25,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default SignIn;
