import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NewTripFormHeader from "@/components/NewTripFormHeader";
import NewTripHeader from "@/components/NewTripHeader";
import { COLORS } from "@/costants/colors";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCurrentlyEditingTrip } from "@/redux/slices/createTripStepsSlice";
import { ModalStatus, updateModal } from "@/redux/slices/modalSlice";

const Step1 = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentlyEditing, currentStep } = useSelector(
    (state: RootState) => state.create_trip_steps
  );

  const isFormValid = () => {
    return (
      currentlyEditing?.start_location_state &&
      currentlyEditing?.start_location_city &&
      currentlyEditing?.destination_location_state &&
      currentlyEditing?.destination_location_city
    );
  };

  const handleNext = () => {
    let isValid = isFormValid();
    if (!isValid) {
      dispatch(
        updateModal({
          title: "Missing Input",
          text: "Please fill in all fields before proceeding.",
          status: ModalStatus.GRAY,
          active: true,
          link: null,
        })
      );
    }

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
            <Text style={styles.heading}>Location details</Text>

            <View style={{ gap: 20 }}>
              {/* Start Location */}
              <View>
                <Text style={styles.label}>Start location</Text>
                <TextInput
                  value={currentlyEditing?.start_location_state}
                  onChangeText={(text) =>
                    dispatch(
                      setCurrentlyEditingTrip({ start_location_state: text })
                    )
                  }
                  placeholder="Enter state"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Enter city"
                  value={currentlyEditing?.start_location_city}
                  onChangeText={(text) =>
                    dispatch(
                      setCurrentlyEditingTrip({ start_location_city: text })
                    )
                  }
                  style={{ ...styles.input, marginTop: 8 }}
                />
              </View>

              {/* Destination */}
              <View>
                <Text style={styles.label}>Destination</Text>
                <TextInput
                  value={currentlyEditing?.destination_location_state}
                  onChangeText={(text) =>
                    dispatch(
                      setCurrentlyEditingTrip({
                        destination_location_state: text,
                      })
                    )
                  }
                  placeholder="Enter destination state"
                  style={styles.input}
                />
                <TextInput
                  value={currentlyEditing?.destination_location_city}
                  onChangeText={(text) =>
                    dispatch(
                      setCurrentlyEditingTrip({
                        destination_location_city: text,
                      })
                    )
                  }
                  placeholder="Enter destination city"
                  style={{ ...styles.input, marginTop: 8 }}
                />
              </View>

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
    fontSize: 16,
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

export default Step1;
