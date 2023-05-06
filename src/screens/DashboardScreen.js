import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import CountdownComponent from "../components/CountdownComponent";
import TasklistComponent from "../components/TasklistComponent";
import LoadingComponent from "../components/LoadingComponent";
import ServiceNavigatorComponent from "../components/ServiceNavigatorComponent";
import { ServiceContext, ServiceProvider } from "../store/ServiceContext";
import { BREAKS, POMODORO } from "../constants/global";

const DashboardScreen = ({ isLoading }) => {
  const { serviceSelected } = useContext(ServiceContext);
  const getBackground = () => {
    if (serviceSelected === POMODORO) {
      return { backgroundColor: "#ba4949" };
    } else {
      return {
        backgroundColor:
          serviceSelected === BREAKS.short ? "#38858a" : "#397097",
      };
    }
  };

  return (
    <View style={[styles.container, getBackground()]}>
      {isLoading ? (
        <LoadingComponent isMain />
      ) : (
        <View style={styles.wrapper}>
          <ServiceNavigatorComponent />
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
  },
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 48,
  },
});

export default () => (
  <ServiceProvider>
    <DashboardScreen />
  </ServiceProvider>
);
