import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import globalStyles from "../css/global";
import { ServiceContext } from "../store/ServiceContext";
import { BREAK, POMODORO } from "../constants/global";

const ServiceNavigatorComponent = () => {
  const { isBreak, toggleService } = useContext(ServiceContext);
  const { centered, rowDirection, whiteText, vPadding1, hPadding1 } =
    globalStyles;

  const getTextColor = (enable, color) => {
    return enable ? { color } : { ...whiteText };
  };

  const getButtonStyle = (enable) => (enable ? { ...styles.active } : {});

  return (
    <View style={[centered, rowDirection, styles.separator]}>
      <TouchableOpacity
        style={[vPadding1, hPadding1, getButtonStyle(!isBreak)]}
        onPress={() => toggleService(false)}
      >
        <Text style={getTextColor(!isBreak, "#ba4949")}>{POMODORO}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[vPadding1, hPadding1, getButtonStyle(isBreak)]}
        onPress={() => toggleService(true)}
      >
        <Text style={getTextColor(isBreak, "#38858a")}>{BREAK}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  active: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
    elevation: 20,
  },
  pomodoro: {
    color: "#ba4949",
  },
  break: {
    color: "#38858a",
  },
  separator: {
    borderBottomWidth: 3,
    borderStyle: "solid",
    borderBottomColor: "#fff",
    marginBottom: 8,
  },
});

export default ServiceNavigatorComponent;
