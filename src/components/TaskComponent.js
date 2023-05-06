import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import globalStyles from "../css/global";

import { FontAwesome } from "@expo/vector-icons";

const TaskComponent = ({ id, taskName, isDone, removeTask, toggleTask }) => {
  const { vPadding1, hPadding1 } = globalStyles;

  const getBackground = () => {
    return { backgroundColor: isDone ? "#6aa181" : "#fff" };
  };

  return (
    <View
      style={[
        styles.container,
        getBackground(),
      ]}
    >
      <View style={[vPadding1, hPadding1, styles.wrapper]}>
        <View style={styles.wrapper}>
          <FontAwesome
            name="close"
            size={16}
            color="black"
            onPress={() => removeTask(id)}
          />
          <Pressable style={styles.taskName} onPress={() => toggleTask(id)}>
            <Text>{taskName}</Text>
          </Pressable>
        </View>
        {isDone ? (
          <FontAwesome
            name="check-circle"
            size={24}
            color="white"
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
    width: "100%",
    marginBottom: 16,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 8,
  },
  doneTask: {
    backgroundColor: "#6aa181 !important",
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskName: {
    width: "90%",
  },
});

export default TaskComponent;
