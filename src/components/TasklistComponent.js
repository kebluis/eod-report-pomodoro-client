import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import globalStyles from "../css/global";
import TaskComponent from "./TaskComponent";
import { getAllTasks } from "../model/DashboardModel";
import { UserContext } from "../store/UserContext";
import { Ionicons } from "@expo/vector-icons";
import AddTaskModal from "./modals/AddTaskModal";

const TasklistComponent = () => {
  const {
    wrapper,
    hPadding1,
    vPadding1,
    vMargin1,
    whiteText,
    fullWidth,
    rowDirection,
    spaceBetween,
  } = globalStyles;

  const { userInfo } = useContext(UserContext);

  const [tasks, setTasks] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const setAllTasks = useCallback(async (id) => {
    const response = await getAllTasks(id);
    setTasks(response);
  }, []);

  useEffect(() => {
    if (!!userInfo?.id) {
      setAllTasks(userInfo?.id);
    }
  }, [userInfo]);

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

  const addTask = () => {
    setIsVisible(true)
  }

  return (
    <>
    <AddTaskModal isVisible={isVisible} />
    
    <View style={[wrapper, hPadding1, vMargin1]}>
      <View style={rowDirection}>
        <Text style={[styles.header, vPadding1, whiteText]}>Task List</Text>
        <Ionicons
          style={[styles.header, styles.addButton, vPadding1]}
          name="add-sharp"
          size={32}
          color="white"
          onPress={addTask}
        />
      </View>
      <FlatList
        style={fullWidth}
        data={tasks}
        keyExtractor={(tasks) => tasks.id}
        renderItem={({ item }) => {
          const { id, description, isDone } = item;
          return (
            <TaskComponent
              key={id}
              id={id}
              taskName={description}
              isDone={isDone}
              removeTask={removeTask}
              toggleTask={toggleTask}
            />
          );
        }}
      />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    alignSelf: "flex-start",
    fontWeight: "700",
    fontSize: 24,
    flex: 1,
  },
  addButton: {
    textAlign:'right',
    marginRight: 8
  },
});

export default TasklistComponent;
