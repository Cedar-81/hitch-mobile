import { COLORS } from "@/costants/colors";
import { ModalStatus, closeModal } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";

const HitchModal = () => {
  const modal = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <Modal
      isVisible={modal.active}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={() => {
        //@ts-ignore
        modal.link && router.push(modal.link);
        dispatch(closeModal());
      }}
    >
      <View
        style={{
          ...styles.modalContainer,
          borderLeftColor:
            modal.status == ModalStatus.SUCCESS
              ? COLORS.success
              : modal.status == ModalStatus.FAILURE
              ? COLORS.error
              : COLORS.darkGray,
        }}
      >
        <Text style={styles.modalTitle}>{modal.title}</Text>
        {modal.text && modal.text.trim() != "" && (
          <Text style={styles.modalText}>{modal.text}</Text>
        )}

        {/* Close Button */}
        {/* <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity> */}
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    borderLeftWidth: 15,
  },
  modalTitle: {
    fontFamily: "Rubik-Medium",
    fontSize: 20,
    marginBottom: 10,
  },
  modalText: {
    fontFamily: "Rubik",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.primary,
  },
});

export default HitchModal;
