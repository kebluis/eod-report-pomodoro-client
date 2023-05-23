import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import CountdownComponent from "../components/CountdownComponent";
import TasklistComponent from "../components/TasklistComponent";
import LoadingComponent from "../components/LoadingComponent";
import ServiceNavigatorComponent from "../components/ServiceNavigatorComponent";
import { ServiceContext, ServiceProvider } from "../store/ServiceContext";
import Navigations from "../components/navigation/Navigations";
import globalStyles from "../css/global";

import { BREAKS, POMODORO } from "../constants/global";

const DashboardScreen = ({ isLoading }) => {
  const { serviceSelected } = useContext(ServiceContext);

  return (
    <View style={[styles.container, globalStyles.containerBg[serviceSelected]]}>
        <View style={styles.navContainer}>
            <Navigations />
        </View>
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
    navContainer: {
        height: 30,
    },
});

export default () => (
  <ServiceProvider>
    <DashboardScreen />
  </ServiceProvider>
);
