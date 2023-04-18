import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { selectionAsync } from "expo-haptics";
import { Audio } from "expo-av";

import globalStyles from "../css/global";
import ConfirmModal from "./modals/ConfirmModal.js";
import CountDown from "react-native-countdown-component";
import * as Notifications from "expo-notifications";

// First, set the handler that will cause the notification
// to show the alert

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const CountdownComponent = ({ _minutes = 1, _seconds = 0 }) => {
  const animation = useRef(null);

  const [timerId, setTimerId] = useState(new Date().getTime().toString());
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
      if (!!alarmSound) alarmSound.unloadAsync();
    };
  }, []);

  const startCountdown = async () => {
    selectionAsync();
    setStart(true);
    await Notifications.setNotificationChannelAsync("countdown-over", {
      name: "Countdown alarm",
      importance: Notifications.AndroidImportance.MAX,
      sound: "alarm.wav", // <- for Android 8.0+, see channelId property below
      lightColor: "#FF231F7C",
      vibrationPattern: [0, 250, 250, 250],
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's Up!",
        body: "Comeback and set your Break time",
        sound: "alarm.wav",
      },
      trigger: { seconds: 10, channelId: "countdown-over" },
    });
  };

  const onFinishCountDown = () => {
    setStart(false);
    alarmSound.replayAsync();
    setShow(true);
  };

  return (
    <View style={[globalStyles.vPadding1, styles.wrapper]}>
      <ConfirmModal
        onNext={() => {
          alarmSound.pauseAsync();
          setTimerId(new Date().getTime().toString());
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
      <CountDown
        digitStyle={globalStyles.bgTransparent}
        digitTxtStyle={[globalStyles.whiteText, styles.counter]}
        separatorStyle={globalStyles.whiteText}
        timeToShow={["M", "S"]}
        timeLabels={{ m: null, s: null }}
        showSeparator
        id={timerId}
        until={10}
        size={48}
        running={start && !show}
        onFinish={onFinishCountDown}
      />

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
