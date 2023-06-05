import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import CountdownComponent from "../components/CountdownComponent";
import TasklistComponent from "../components/TasklistComponent";
import LoadingComponent from "../components/LoadingComponent";
import ServiceNavigatorComponent from "../components/ServiceNavigatorComponent";
import { ServiceContext, ServiceProvider } from "../store/ServiceContext";
import Navigations from "../components/navigation/Navigations";
import globalStyles from "../css/global";
import axios from "axios";
import getEnvVars from "../../environment";

import { BREAKS, POMODORO } from "../constants/global";
import { AuthContext } from "../store/AuthContext";

const DashboardScreen = () => {
  const { serviceSelected, userSettings, storeUserSettings } = useContext(ServiceContext);
  const { token, userInfo } = useContext(AuthContext);
  const { backEndApi } = getEnvVars();

  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    getUserSettings();
  }, [token, userInfo]);

  const getUserSettings = async () => {
    await axios.get(backEndApi + 'user-settings/' + userInfo.id, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    .then(async response => {
      console.log('settings fetched: ', response.data);
      await storeUserSettings(response.data);
      await setLoading(false);
    }).catch(error => {
      console.log('error on setttings:', error);
    });
  }

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
