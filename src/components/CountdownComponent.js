import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import globalStyles from "../css/global";

const CountdownComponent = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  return (
    <View style={[globalStyles.vPadding1, styles.wrapper]}>
      <Text style={[globalStyles.whiteText, styles.counter]}>
        {minutes}:
        {seconds.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </Text>
      <Button title="Start" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
  },
  counter: {
    fontSize: 80,
    textAlign: "center",
  },
  
});

export default CountdownComponent;
