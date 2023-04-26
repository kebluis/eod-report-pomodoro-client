import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import globalStyles from '../../css/global.js'

const ConfirmModal = ({
  children,
  onNext,
  onCancel,
  isVisible,
  cancelText,
  nextText,
}) => {
  return (
    <Modal animationType="slide" transparent visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>TIME'S UP</Text>
        </View>

        {children}
        <View style={styles.buttonContainer}>
          <Pressable style={[styles.button, styles.cancel]} onPress={onCancel}>
            <Text>{cancelText}</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.next]} onPress={onNext}>
            <Text style={globalStyles.whiteText}>{nextText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    height: "50%",
    width: "100%",
    backgroundColor: "#25292e",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    height: "15%",
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    justifyContent:"center"
  },
  title: {
    color: "#fff",
    fontSize: 32,
  },
  buttonContainer: {
    flexDirection: "row",
    width: '100%'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 24,
    marginHorizontal: 36,
    padding: 24,
    borderRadius: 10,
  },
  cancel:{
    backgroundColor: '#fff'
  },
  next: {
    backgroundColor: '#ba4949'
  }

});

export default ConfirmModal;
