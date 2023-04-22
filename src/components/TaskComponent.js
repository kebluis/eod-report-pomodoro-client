import React from "react";
import { Text, View, StyleSheet } from "react-native";
import globalStyles from "../css/global";

import { FontAwesome } from "@expo/vector-icons";

const TaskComponent = ({ id, taskName, isDone, removeTask, toggleTask }) => {
  const { vPadding1, hPadding1, hMargin1 } = globalStyles;
  return (
    <View style={styles.container}>
      <View style={[vPadding1, hPadding1, styles.wrapper]}>
        <View style={styles.wrapper}>
          <FontAwesome
            name="close"
            size={16}
            color="black"
            onPress={() => removeTask(id)}
          />
          <Text style={styles.taskName}>{taskName}</Text>
        </View>
        {isDone ? (
          <FontAwesome
            name="check-circle"
            size={24}
            color="green"
            onPress={() => toggleTask(id)}
          />
        ) : (
          <FontAwesome
            name="check-circle-o"
            size={24}
            color="black"
            onPress={() => toggleTask(id)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: 16,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 20
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskName: {
    width: '90%',
  }
});

export default TaskComponent;
