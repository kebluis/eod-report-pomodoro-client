import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import globalStyles from "../css/global";

import LottieView from "lottie-react-native";

const CountdownComponent = ({ _minutes = 1, _seconds = 0 }) => {
  const animation = useRef(null);
  const [minutes, setMinutes] = useState(_minutes);
  const [seconds, setSeconds] = useState(_seconds);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const timeout = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const deductSeconds = async () => {
      await timeout(1000);
      setSeconds((prev) => --prev);
    };

    const deductMinutes = async () => {
      await timeout(1000);
      if (minutes > 0) {
        setMinutes((prev) => --prev);
        setSeconds(59);
      } else {
        setMinutes(_minutes);
        setSeconds(_seconds);
        setStart(false);
      }
    };
    if (start) seconds === 0 ? deductMinutes() : deductSeconds();
  }, [seconds]);

  const startCountdown = () => {
    setStart(true);
    setTimeout(() => {
      setMinutes((prev) => --prev);
      setSeconds(59);
    }, 1000);
  };

  const formattedTime = (time) =>
    time.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

  return (
    <View style={[globalStyles.vPadding1, styles.wrapper]}>
      <Text style={[globalStyles.whiteText, styles.counter]}>
        {formattedTime(minutes)}:{formattedTime(seconds)}
      </Text>

      {start ? (
        <View style={styles.animationContainer}>
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 200,
              height: 200,
            }}
            source={require("../../assets/backToSchool.json")}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={startCountdown} style={styles.start}>
          <Text>START</Text>
        </TouchableOpacity>
      )}
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
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  start: {
    width: 100,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});

export default CountdownComponent;
