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
import { BREAKS, NOTIFICATION, POMODORO, STOP } from "../constants/global";
import { AuthContext } from "../store/AuthContext";

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
  const {
    serviceSelected,
    changeService,
    isCountdownStarted,
    toggleCountdown,
    userSettings
  } = useContext(ServiceContext);

  const startTimer = useRef(null);
  const doneTask = useRef(null);
  const countdownTimer = useRef(null);

  const [timerId, setTimerId] = useState(new Date().getTime().toString());
  const [show, setShow] = useState(false);
  const [alarmSound, setAlarmSound] = useState(null);
  const [pause, setPause] = useState(true);
  const [timeInSeconds, setTimeInSeconds] = useState(2);

  useEffect(() => {
    const init = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/alarm.wav")
      );
      setAlarmSound(sound);
      setTimer();

    };
    init();
    return () => {
      if (!!alarmSound) alarmSound.unloadAsync();
    };
  }, []);


  useEffect(() => {
    setTimer();
  }, [userSettings, serviceSelected]);

  const setTimer = async () => {
      switch (serviceSelected) {
        case POMODORO:
          await setTimeInSeconds((userSettings.pomodoroTime || 0) * 60);
          break;
        case BREAKS.short:
          await setTimeInSeconds((userSettings.shortBreak || 0) * 60);
          break;
        case BREAKS.long:
          await setTimeInSeconds((userSettings.longBreak || 0) * 60);
          break;
        default:
          await setTimeInSeconds(11);
          break;
      }
    if (alarmSound) {
      resetAlarm();
    } else {
      setTimerId(new Date().getTime().toString());
    }
  }

  const startCountdown = async () => {
    setPause(false);
    if (!isCountdownStarted) {
      startTimer.current?.reset();
      doneTask.current?.reset();
      selectionAsync();
      toggleCountdown(true);
    }
    await Notifications.setNotificationChannelAsync("countdown-over", {
      name: NOTIFICATION.title,
      importance: Notifications.AndroidImportance.MAX,
      sound: "alarm.wav", // <- for Android 8.0+, see channelId property below
      lightColor: "#FF231F7C",
      vibrationPattern: [0, 250, 250, 250],
      bypassDnd: true,
      lockscreenVisibility:
        Notifications.AndroidNotificationVisibility.PUBLIC,
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
        body:
          serviceSelected !== POMODORO
            ? NOTIFICATION.breakMsg
            : NOTIFICATION.pomoMsg,
        sound: "alarm.wav",
        priority: Notifications.AndroidNotificationPriority.MAX,
        color: "red",
      },
      trigger: { seconds: countdownTimer?.current?.state?.until, channelId: "countdown-over" },
    });
  };

  const onFinishCountDown = () => {
    doneTask.current?.play();
    toggleCountdown(false);
    setShow(true);
    alarmSound.replayAsync();
  };

  const resetAlarm = () => {
    alarmSound.pauseAsync();
    setTimerId(new Date().getTime().toString());
    setShow(false);
    setPause(false);
  };

  return (
    <View style={[globalStyles.vPadding1, globalStyles.wrapper]}>
      <ConfirmModal
        onNext={() => {
          changeService(serviceSelected === POMODORO ? BREAKS.short : POMODORO);
          resetAlarm();
        }}
        onCancel={resetAlarm}
        isVisible={show}
        nextText={`${serviceSelected === POMODORO ? BREAKS.short : POMODORO}`}
        cancelText={STOP}
      >
        <View style={styles.animationContainer}>
          {serviceSelected === POMODORO ? (
            <LottieView
              autoPlay
              ref={doneTask}
              style={globalStyles.doneAnimation}
              source={require("../../assets/done.json")}
            />
          ) : (
            <LottieView
              autoPlay
              ref={doneTask}
              style={globalStyles.doneAnimation}
              source={require("../../assets/meditatingWork.json")}
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
        until={timeInSeconds}
        size={48}
        running={!pause && isCountdownStarted && !show}
        onFinish={onFinishCountDown}
        ref={countdownTimer}
      />

      <View style={styles.animationContainer}>
        {!pause && isCountdownStarted && !show ? (
          <FontAwesome
            name="pause-circle"
            size={48}
            color="white"
            onPress={() => {setPause(true);
            Notifications.cancelAllScheduledNotificationsAsync();
            }}
          />
        ) : (
          <FontAwesome
            name="play-circle"
            size={48}
            color="white"
            onPress={startCountdown}
          />
        )}
        {isCountdownStarted && !show && (
          <View>
            {serviceSelected === POMODORO ? (
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
                source={
                  serviceSelected === BREAKS.short
                    ? require("../../assets/typing.json")
                    : require("../../assets/seaWalk.json")
                }
              />
            )}
          </View>
        )}
      </View>
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
