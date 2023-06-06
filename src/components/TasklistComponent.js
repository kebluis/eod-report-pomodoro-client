import React, { useCallback, useEffect, useState, useContext } from "react";
import { Text, View, StyleSheet, Pressable, FlatList, TextInput } from "react-native";
import globalStyles from "../css/global";
import TaskComponent from "./TaskComponent";
import { ServiceContext } from "../store/ServiceContext";
import axios from "axios";
import getEnvVars from "../../environment";

import tasksData from "../model/mock/tasks";
// import { getAllTasks } from "../model/DashboardModel";
import { AuthContext } from "../store/AuthContext";
import { FontAwesome } from "@expo/vector-icons";

const TasklistComponent = () => {
  const { wrapper, hPadding1, vPadding1, vMargin1, whiteText, fullWidth } =
    globalStyles;

  const { token, userInfo } = useContext(AuthContext);
  const [tasks, setTasks] = useState(null);
  const [taskGroup, setTaskGroup] = useState(null);
  const { serviceSelected } = useContext(ServiceContext);
  const { backEndApi } = getEnvVars();
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
      getAllTasks()
    // if(!!tasks) {
    // }
  }, [userInfo, token]);

  const getAllTasks = async () => {
    await axios.get(backEndApi + 'task/tasks/' + userInfo.id, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    .then(async response => {
      setTasks(response.data);
    }).catch(error => {
      console.log('error on task', error);
    });
  }

  // TODO: replace & insert 'task delete API' here
  const removeTask = async (_id) => {
    await axios.delete(backEndApi + 'task/' + _id,
      {
          headers: {
              Authorization: "Bearer " + token
          }
      }
    ).then(response => {
      getAllTasks();
    }).catch(error => {
      console.log('error on task', error);
    });
  }

  const toggleTask = async (_id) => {
    const updateTask = tasks.find(task => task.id === _id);
    await axios.put(backEndApi + 'task/' + _id,
      {
        isDone: !updateTask.isDone,
        description: updateTask.description,
        isEmailSent: updateTask.isEmailSent,
        userId: userInfo.id,
      },
      {
          headers: {
              Authorization: "Bearer " + token
          }
      }
    ).then(async response => {
      getAllTasks();
    }).catch(error => {
      console.log('error on task', error);
    });
  };

  const getTaskGroupId = () => {
    if (tasks.length) {
      return tasks[0].taskGroup.id;
    }

    return null;
  }

  const addTask = async () => {
    console.log("++++++++++++++++++++++++++++++++++++");
    const taskGroupId = getTaskGroupId();
    const data = {
      description: newTask,
      isDone: false,
      isEmailSent: false,
      userId: userInfo.id
    };

    if (taskGroupId !== null) {
      data.taskGroupId = taskGroupId;
    }

    await axios.post(backEndApi + 'task',
      data,
      {
          headers: {
              Authorization: "Bearer " + token
          }
      }
    ).then(response => {
      getAllTasks();
      setNewTask("");
    }).catch(error => {
      console.log('error on task', error);
    });

  }

  return (
    <View style={[wrapper, hPadding1, vMargin1]}>
      <Text style={[styles.header, vPadding1, whiteText]}>Task List</Text>
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
      <View style={[
        styles.container,
      ]}>
        <View style={[vPadding1, hPadding1, styles.wrapper]}>
          <View style={styles.wrapper}>
            <TextInput
                style={styles.addTask}
                placeholder="task description"
                onChangeText={setNewTask}
                value={newTask}
                placeholderTextColor="black"
            />
            <FontAwesome
              name="plus"
              size={16}
              color="black"
              onPress={addTask}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
      // <View style={styles.buttonContainer}>
      //   <Pressable style={[styles.button, globalStyles.button[serviceSelected]]} onPress={() => {}}>
      //       <Text style={globalStyles.whiteText}>Let's start our Day</Text>
      //   </Pressable>
      // </View>

const styles = StyleSheet.create({
  header: {
    alignSelf: "flex-start",
    fontWeight: "700",
    fontSize: 24,
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
  container: {
    borderRadius: 10,
    width: "100%",
    marginBottom: 16,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 8,
    backgroundColor: "#fff"
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addTask: {
    width: "95%",
  },
});

export default TasklistComponent;
