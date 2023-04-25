import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import globalStyles from "../css/global";

const ServiceNavigatorComponent = () => {
  const { centered, rowDirection, whiteText } = globalStyles;

  return (
    <View style={[centered, rowDirection]}>
      <Pressable>
        <Text style={whiteText}>Pomodoro</Text>
      </Pressable>
      <Pressable>
        <Text style={whiteText}>Break</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ServiceNavigatorComponent;
