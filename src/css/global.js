import { StyleSheet } from "react-native";
import { BREAKS, POMODORO } from "../constants/global";

export default StyleSheet.create({
  whiteText: {
    color: "#fff",
  },
  bgTransparent: {
    backgroundColor: "rgba(0,0,0,0)",
  },
  vMargin1: {
    marginVertical: 16,
  },
  hMargin1: {
    marginHorizontal: 16,
  },
  vPadding1: {
    paddingVertical: 16,
  },
  hPadding1: {
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: "100%",
  },
  wrapper: {
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  doneAnimation: {
    width: 200,
    height: 200,
    marginLeft: 12,
  },
  startAnimation: {
    width: 100,
    height: 100,
    marginLeft: 4,
  },
  centered: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rowDirection: {
    display: "flex",
    flexDirection: "row",
  },
  modalContent: {
    height: "50%",
    width: "100%",
    backgroundColor: "#25292e",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  containerBg: {
    [POMODORO]: {
      backgroundColor: "#ba4949",
      color: 'white',
    },
    [BREAKS.short]: {
      backgroundColor: "#38858a",
      color: 'white',
    },
    [BREAKS.long]: {
      backgroundColor: "#397097",
      color: 'white',
    },
  },
  button: {
    [POMODORO]: {
      backgroundColor: "#c15c5c",
    },
    [BREAKS.short]: {
      backgroundColor: "#4c9196",
    },
    [BREAKS.long]: {
      backgroundColor: "#4c7fa2",
    }
  },
});
