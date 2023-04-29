import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { selectionAsync } from "expo-haptics";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";

import globalStyles from "../css/global";
import ConfirmModal from "./modals/ConfirmModal.js";
import CountDown from "react-native-countdown-component";
import * as Notifications from "expo-notifications";
import { ServiceContext } from "../store/ServiceContext";
import { BREAK, NOTIFICATION, POMODORO, STOP } from "../constants/global";

// First, set the handler that will cause the notification
// to show the alert

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

const CountdownComponent = ({ _minutes = 1, _seconds = 0 }) => {
  const { isBreak, toggleService } = useContext(ServiceContext);

  const startTimer = useRef(null);
  const doneTask = useRef(null);

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
    startTimer.current?.reset();
    doneTask.current?.reset();
    selectionAsync();
    setStart(true);
    await Notifications.setNotificationChannelAsync("countdown-over", {
      name: NOTIFICATION.title,
      importance: Notifications.AndroidImportance.MAX,
      sound: "alarm.wav", // <- for Android 8.0+, see channelId property below
      lightColor: "#FF231F7C",
      vibrationPattern: [0, 250, 250, 250],
      bypassDnd: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      enableLights: true,
      enableVibrate: true,
      showBadge: true,
      audioAttributes: {
        contentType: Notifications.AndroidAudioContentType.MUSIC,
        usage: Notifications.AndroidAudioUsage.ALARM,
      },
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION.timeUp,
        body: isBreak
          ? NOTIFICATION.breakMsg
          : NOTIFICATION.pomoMsg,
        sound: "alarm.wav",
        priority: Notifications.AndroidNotificationPriority.MAX,
        color: "red",
      },
      trigger: { seconds: 10, channelId: "countdown-over" },
    });
  };

  const onFinishCountDown = () => {
    doneTask.current?.play();
    setStart(false);
    setShow(true);
    alarmSound.replayAsync();
  };

  const resetAlarm = () => {
    alarmSound.pauseAsync();
    setTimerId(new Date().getTime().toString());
    setShow(false);
  };

  return (
    <View style={[globalStyles.vPadding1, globalStyles.wrapper]}>
      <ConfirmModal
        onNext={() => {
          toggleService(!isBreak);
          resetAlarm()
        }}
        onCancel={resetAlarm}
        isVisible={show}
        nextText={`${isBreak ? POMODORO : BREAK}`}
        cancelText={STOP}
      >
        <View style={styles.animationContainer}>
          {isBreak ? (
            <LottieView
              autoPlay
              ref={doneTask}
              style={globalStyles.doneAnimation}
              source={require("../../assets/meditatingWork.json")}
            />
          ) : (
            <LottieView
              autoPlay
              ref={doneTask}
              style={globalStyles.doneAnimation}
              source={require("../../assets/done.json")}
            />
          )}
        </View>
      </ConfirmModal>
      <CountDown
        digitStyle={globalStyles.bgTransparent}
        digitTxtStyle={{ ...globalStyles.whiteText, ...styles.counter }}
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

      {start && !show && (
        <View style={styles.animationContainer}>
          <FontAwesome name="pause-circle" size={48} color="white" />

          <View>
            {!isBreak ? (
              <LottieView
                autoPlay
                ref={startTimer}
                style={globalStyles.startAnimation}
                source={require("../../assets/backToSchool.json")}
              />
            ) : (
              <LottieView
                autoPlay
                ref={startTimer}
                style={globalStyles.startAnimation}
                source={require("../../assets/typing.json")}
              />
            )}
          </View>
        </View>
      )}
      {!start && !show && (
        <FontAwesome
          name="play-circle"
          size={48}
          color="white"
          onPress={startCountdown}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  counter: {
    fontSize: 80,
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
