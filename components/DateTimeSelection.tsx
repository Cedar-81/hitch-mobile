import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "@/costants/colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCurrentlyEditingTrip } from "@/redux/slices/createTripStepsSlice";
import { ModalStatus, updateModal } from "@/redux/slices/modalSlice";

export default function DateTimeSelection({
  startDateTime,
  endDateTime,
  setStartDateTime,
  setEndDateTime,
}: {
  endDateTime: Date;
  startDateTime: Date;
  setStartDateTime: React.Dispatch<React.SetStateAction<Date>>;
  setEndDateTime: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const dispatch = useDispatch();
  const { currentlyEditing } = useSelector(
    (state: RootState) => state.create_trip_steps
  );

  const [showPicker, setShowPicker] = useState<{
    field: "start" | "end";
    mode: "date" | "time";
  } | null>(null);

  const openPicker = (field: "start" | "end", mode: "date") => {
    setShowPicker({ field, mode });
  };

  const handleConfirm = (event: any, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowPicker(null);
      return;
    }

    let updatedEditing = { ...currentlyEditing };

    const formatAppwriteDate = (date: Date) => {
      return date.toISOString().replace("T", " ").split(".")[0];
    };

    if (showPicker) {
      if (showPicker.field === "start") {
        if (selectedDate > endDateTime) {
          dispatch(
            updateModal({
              title: "Invlid Date",
              text: "Start time must be before the end time.",
              status: ModalStatus.GRAY,
              active: true,
            })
          );
          return;
        }
        setStartDateTime(selectedDate);
        updatedEditing.start_date_time = formatAppwriteDate(selectedDate);
      } else {
        if (selectedDate < startDateTime) {
          dispatch(
            updateModal({
              title: "Invlid Date",
              text: "End time must be after the start time.",
              status: ModalStatus.GRAY,
              active: true,
            })
          );
          return;
        }
        setEndDateTime(selectedDate);
        updatedEditing.end_date_time = formatAppwriteDate(selectedDate);
      }

      setShowPicker(
        showPicker.mode === "date"
          ? { field: showPicker.field, mode: "time" }
          : null
      );

      dispatch(setCurrentlyEditingTrip(updatedEditing));
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={{ gap: 20 }}>
      <View>
        <Text style={styles.label}>Start Date & Time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => openPicker("start", "date")}
        >
          <Text>{formatDateTime(startDateTime)}</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.label}>End Date & Time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => openPicker("end", "date")}
        >
          <Text>{formatDateTime(endDateTime)}</Text>
        </TouchableOpacity>
      </View>

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={showPicker.field === "start" ? startDateTime : endDateTime}
          mode={showPicker.mode}
          display="spinner"
          onChange={handleConfirm}
        />
      )}

      {showPicker && Platform.OS === "ios" && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <DateTimePicker
              value={showPicker.field === "start" ? startDateTime : endDateTime}
              mode={showPicker.mode}
              display="spinner"
              onChange={handleConfirm}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowPicker(null)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: "Rubik-Medium",
    fontSize: 16,
    color: COLORS.primary90,
    paddingBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "Rubik-Medium",
  },
});
