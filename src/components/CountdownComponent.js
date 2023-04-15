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
    await Notifications.setNotificationChannelAsync('new-emails', {
      name: 'E-mail notifications',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'alarm.wav', // <- for Android 8.0+, see channelId property below
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's Up!",
        body: "Comeback and set your Break time",
      },
      trigger: { seconds: _minutes * 60 + _seconds, channelId:'new-emails' },
    });
  };

  const onFinishCountDown = () => {
    setTimerId(new Date().getTime().toString())
    alarmSound.replayAsync();
    setStart(false);
    setShow(true);
  };

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
      <CountDown
      id={timerId}
        until={_minutes * 60 + _seconds}
        size={20}
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
