import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { selectionAsync } from "expo-haptics";
import { Audio } from "expo-av";

import globalStyles from "../css/global";
import ConfirmModal from "./modals/ConfirmModal.js";

const CountdownComponent = ({ _minutes = 1, _seconds = 0 }) => {
  const animation = useRef(null);
  const [minutes, setMinutes] = useState(_minutes);
  const [seconds, setSeconds] = useState(_seconds);
  const [start, setStart] = useState(false);
  const [show, setShow] = useState(false);
  const [alarmSound, setAlarmSound] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/alarm.wav")
      );
      setAlarmSound(sound);
    };

    init();
    return () => {
      if(!!alarmSound) alarmSound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    const timeout = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const deductSeconds = async () => {
      // timeout time should be 1000 ms rather than 300 ms. 
      // This is just currently the settings to not actually wait for a whole minute every time we test the app
      await timeout(300);
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
        alarmSound.replayAsync();
        setShow(true);
      }
    };
    if (start) seconds === 0 ? deductMinutes() : deductSeconds();
  }, [seconds]);

  const startCountdown = () => {
    selectionAsync();
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
      <ConfirmModal
        onNext={() => {
          alarmSound.pauseAsync();
          setShow(false);
          setStart(false);
        }}
        onCancel={() => {
          alarmSound.pauseAsync();
          setShow(false);
          setStart(false);
        }}
        isVisible={show}
        nextText="Break"
        cancelText="Stop"
      />
      <Text style={[globalStyles.whiteText, styles.counter]}>
        {formattedTime(minutes)}:{formattedTime(seconds)}
      </Text>

      {start ? (
        show ? (
          <View style={styles.animationContainer}>
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 200,
                height: 200,
              }}
              source={require("../../assets/done.json")}
            />
          </View>
        ) : (
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
        )
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
    marginLeft: 20,
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
