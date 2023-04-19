import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import globalStyles from '../css/global'

const TasklistComponent = () => {
  return (
    <View style={globalStyles.wrapper}>
      <Text style={styles.header}>Task List</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignSelf: "flex-start",
    margin: 16,
  }
})

export default TasklistComponent;
