import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import globalStyles from "../css/global";
import { ServiceContext } from "../store/ServiceContext";
import { serviceNavigation } from "../model/serviceNavigation";

const ServiceNavigatorComponent = () => {
  const { serviceSelected, changeService, isCountdownStarted } =
    useContext(ServiceContext);
  const { centered, whiteText, vPadding1, hPadding1 } = globalStyles;

  const getTextColor = (service, color) => {
    return serviceSelected === service ? { color } : { ...whiteText };
  };

  const getButtonStyle = (service) =>
    serviceSelected === service ? { ...styles.active } : {};

  return (
    <View style={styles.separator}>
      <FlatList
        contentContainerStyle={[centered, styles.flex]}
        horizontal
        data={serviceNavigation}
        keyExtractor={(service) => service.title}
        renderItem={({ item }) => {
          const { title, color } = item;
          return (
            <TouchableOpacity
              style={[vPadding1, hPadding1, getButtonStyle(title)]}
              onPress={() => !isCountdownStarted && changeService(title)}
            >
              <Text style={getTextColor(title, color)}>{title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  active: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
    elevation: 8,
  },
  separator: {
    borderBottomWidth: 3,
    borderStyle: "solid",
    borderBottomColor: "#fff",
    marginBottom: 8,
  },
});

export default ServiceNavigatorComponent;
