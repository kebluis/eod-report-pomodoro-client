import React from "react";
import { StyleSheet, Text, View } from "react-native";
import globalStyles from '../css/global'
import CountdownComponent from "../components/CountdownComponent";

const DashboardScreen = () => {
  return <View style={styles.container}>
    <View style={styles.wrapper}>

    <CountdownComponent />
    </View>
  </View>
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#ba4949',
  },
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 48,
  }

})

export default DashboardScreen;
