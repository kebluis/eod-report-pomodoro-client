import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import globalStyles from "../../css/global.js";

const AddTaskModal = ({ children, isVisible, taskName, setTaskName }) => {
  return (
    <Modal animationType="fade" transparent visible={isVisible}>
      <View style={globalStyles.modalContent}>
        <Text style={globalStyles.whiteText}>Task Name:</Text>
        <TextInput style={globalStyles.whiteText} value={taskName} onChange={setTaskName} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default AddTaskModal;
