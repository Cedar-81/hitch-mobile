import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NewTripFormHeader from "@/components/NewTripFormHeader";
import NewTripHeader from "@/components/NewTripHeader";
import { COLORS } from "@/costants/colors";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCurrentlyEditingTrip } from "@/redux/slices/createTripStepsSlice";
import { createTrip } from "@/lib/apiServices/tripsService";
import { ModalStatus, updateModal } from "@/redux/slices/modalSlice";

const Step3 = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const { currentlyEditing } = useSelector(
    (state: RootState) => state.create_trip_steps
  );

  const handleFinish = async () => {
    setIsLoading(true);
    if (!currentlyEditing?.car_type || !currentlyEditing?.passenger_count) {
      dispatch(
        updateModal({
          title: "Please fill all fields before proceeding.",
          status: ModalStatus.GRAY,
          active: true,
        })
      );
      setIsLoading(false);
      return;
    }

    if (!user) {
      updateModal({
        title: "Couldn't retrieve user at the moment, please try again later.",
        status: ModalStatus.FAILURE,
        active: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      await createTrip({
        ...currentlyEditing,
        users: user.$id,
      });

      dispatch(
        updateModal({
          title: "Trip created successfully!",
          text: undefined,
          status: ModalStatus.SUCCESS,
          link: "/(root)/(tabs)",
          active: true,
        })
      );

      setIsLoading(false);

      // router.push(""); // Navigate to the trips page
    } catch (error) {
      setIsLoading(false);
      dispatch(
        updateModal({
          title: "Couldn't create trip at the moment please try again later",
          status: ModalStatus.FAILURE,
          active: true,
        })
      );
      console.error("Error creating trip:", error);
    }
  };

  if (isLoading)
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </SafeAreaView>
    );

  return (
    <ScrollView>
      <SafeAreaView style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <NewTripHeader />
        <View
          style={{
            borderRadius: 30,
            borderWidth: 1,
            borderColor: COLORS.gray,
            overflow: "hidden",
            paddingBottom: 40,
          }}
        >
          <NewTripFormHeader />
          <View
            style={{
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Rubik-Medium",
                fontSize: 20,
                color: COLORS.primary,
                paddingVertical: 16,
              }}
            >
              Aesthetic details
            </Text>

            <View style={{ gap: 20 }}>
              <View>
                <Text
                  style={{
                    fontFamily: "Rubik-Medium",
                    fontSize: 16,
                    color: COLORS.primary90,
                    paddingBottom: 8,
                  }}
                >
                  Car type
                </Text>
                <TextInput
                  value={currentlyEditing?.car_type}
                  onChangeText={(text) =>
                    dispatch(setCurrentlyEditingTrip({ car_type: text }))
                  }
                  placeholder="Enter car type (e.g., Hyundai)"
                  style={styles.input}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontFamily: "Rubik-Medium",
                    fontSize: 16,
                    color: COLORS.primary90,
                    paddingBottom: 8,
                  }}
                >
                  Passenger count
                </Text>
                <TextInput
                  value={String(currentlyEditing?.passenger_count)}
                  onChangeText={(text) =>
                    dispatch(
                      setCurrentlyEditingTrip({ passenger_count: Number(text) })
                    )
                  }
                  keyboardType="numeric"
                  placeholder="Enter number of passengers"
                  style={styles.input}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text
                  style={{
                    fontFamily: "Rubik-Medium",
                    fontSize: 16,
                    color: COLORS.white,
                  }}
                >
                  Finish
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
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
  },

  button: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default Step3;
