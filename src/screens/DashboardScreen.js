import React from "react";
import { StyleSheet, Text, View } from "react-native";
import globalStyles from "../css/global";
import CountdownComponent from "../components/CountdownComponent";
import TasklistComponent from "../components/TasklistComponent";
import LoadingComponent from "../components/LoadingComponent";

const DashboardScreen = ({isLoading}) => {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingComponent isMain/>
      ) : (
        <View style={styles.wrapper}>
          <CountdownComponent />
          <TasklistComponent />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#ba4949",
  },
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 48,
  },
});

export default DashboardScreen;
