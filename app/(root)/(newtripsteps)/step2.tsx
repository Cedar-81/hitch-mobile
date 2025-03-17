import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NewTripFormHeader from "@/components/NewTripFormHeader";
import NewTripHeader from "@/components/NewTripHeader";
import { COLORS } from "@/costants/colors";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DateTimeSelection from "@/components/DateTimeSelection";
import { setCurrentlyEditingTrip } from "@/redux/slices/createTripStepsSlice";
import { ModalStatus, updateModal } from "@/redux/slices/modalSlice";

const Step2 = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentlyEditing, currentStep } = useSelector(
    (state: RootState) => state.create_trip_steps
  );

  const [startDateTime, setStartDateTime] = useState<Date>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date>(new Date());
  const [price, setPrice] = useState<string>("");

  // Check if inputs are valid
  const isFormValid = () => {
    if (!startDateTime || !endDateTime || !price) {
      return false;
    }
    return startDateTime < endDateTime;
  };

  const handleNext = () => {
    if (!startDateTime || !endDateTime || !price) {
      dispatch(
        updateModal({
          title: "Missing Input",
          text: "Please fill in all fields before proceeding.",
          status: ModalStatus.GRAY,
          active: true,
          link: null,
        })
      );
      return;
    }

    if (startDateTime >= endDateTime) {
      dispatch(
        updateModal({
          title: "Invalid Time",
          text: "Start time must be before the end time.",
          status: ModalStatus.GRAY,
          active: true,
        })
      );
      return;
    }

    // Proceed to next step
    //@ts-ignore
    router.push(`/(root)/(newtripsteps)/step${currentStep + 1}`);
  };

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
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.heading}>Journey details</Text>

            <View style={{ gap: 20 }}>
              {/* Travel Price Input */}
              <View>
                <Text style={styles.label}>Travel price</Text>
                <TextInput
                  value={price}
                  onChangeText={(text) => setPrice(text)}
                  keyboardType="numeric"
                  placeholder="Enter price"
                  style={styles.input}
                />
              </View>

              {/* DateTime Selection */}
              <DateTimeSelection
                startDateTime={startDateTime}
                endDateTime={endDateTime}
                setStartDateTime={setStartDateTime}
                setEndDateTime={setEndDateTime}
              />

              {/* Next Button */}
              <TouchableOpacity
                onPress={handleNext}
                style={[
                  styles.button,
                  {
                    backgroundColor: isFormValid()
                      ? COLORS.primary
                      : COLORS.gray,
                  },
                ]}
                disabled={!isFormValid()}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Rubik-Medium",
    fontSize: 20,
    color: COLORS.primary,
    paddingVertical: 16,
  },
  label: {
    fontFamily: "Rubik-Medium",
    fontSize: 16,
    color: COLORS.primary90,
    paddingBottom: 8,
  },
  input: {
    fontFamily: "Rubik",
    fontSize: 13,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: COLORS.gray,
  },
  button: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "Rubik-Medium",
    fontSize: 16,
    color: COLORS.white,
  },
});

export default Step2;
