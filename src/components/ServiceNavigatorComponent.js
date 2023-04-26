import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import globalStyles from "../css/global";

const ServiceNavigatorComponent = ({onBreak}) => {
  const { centered, rowDirection, whiteText, vPadding1, hPadding1 } =
    globalStyles;

  const [breakActive, setBreakActive] = useState(false);

  useEffect(() => {
    onBreak(breakActive)
  }, [breakActive])

  const getTextColor = (enable, color) => {
    return enable ? { color } : { ...whiteText };
  };

  const getButtonStyle = (enable) => (enable ? { ...styles.active } : {});

  return (
    <View style={[centered, rowDirection, styles.separator]}>
      <TouchableOpacity
        style={[vPadding1, hPadding1, getButtonStyle(!breakActive)]}
        onPress={() => setBreakActive(false)}
      >
        <Text style={getTextColor(!breakActive, "#ba4949")}>Pomodoro</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[vPadding1, hPadding1, getButtonStyle(breakActive)]}
        onPress={() => setBreakActive(true)}
      >
        <Text style={getTextColor(breakActive, "#38858a")}>Break</Text>
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
    marginBottom: 8
  },
});

export default ServiceNavigatorComponent;
