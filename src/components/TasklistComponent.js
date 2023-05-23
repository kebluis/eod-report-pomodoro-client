import React, { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
import globalStyles from "../css/global";
import TaskComponent from "./TaskComponent";

import tasksData from "../model/mock/tasks";
import { getAllTasks } from "../model/DashboardModel";

const TasklistComponent = () => {
  const { wrapper, hPadding1, vPadding1, vMargin1, whiteText, fullWidth } =
    globalStyles;

  const [tasks, setTasks] = useState(null);

  const setAllTasks = useCallback(async() => {
    const response = await getAllTasks(1);
    setTasks(response);
  }, [])

  useEffect(() => {
    if(!!tasks) {
      setAllTasks()
    }
  }, [])

  // TODO: replace & insert 'task delete API' here
  const removeTask = (_id) =>
    setTasks((prev) => prev.filter((data) => data.id !== _id));

  // TODO: replace & insert 'update task checkbox' API here
  const toggleTask = (_id) => {
    const _tasks = tasks.map((task) => {
      if (task.id === _id) {
        return {
          ...task,
          isDone: !task.isDone,
        };
      }
      return task;
    });
    setTasks(_tasks);
  };

  return (
    <View style={[wrapper, hPadding1, vMargin1]}>
      <Text style={[styles.header, vPadding1, whiteText]}>Task List</Text>
      <FlatList
        style={fullWidth}
        data={tasks}
        keyExtractor={(tasks) => tasks.id}
        renderItem={({ item }) => {
          const { id, taskName, isDone } = item;
          return (
            <TaskComponent
              key={id}
              id={id}
              taskName={taskName}
              isDone={isDone}
              removeTask={removeTask}
              toggleTask={toggleTask}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignSelf: "flex-start",
    fontWeight: "700",
    fontSize: 24,
  },
});

export default TasklistComponent;
