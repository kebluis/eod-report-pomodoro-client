import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";
import { ServiceContext } from "../../store/ServiceContext";

import Settings from "../../screens/Settings";
import globalStyles from "../../css/global";


const Navigations = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { isBreak } = useContext(ServiceContext);
    const mode = isBreak ? 'break' : 'pomo';

    const showSettings = () => {
        setModalVisible(true);
    };

    const hideSettings = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, globalStyles.button[mode]]}
                onPress={showSettings}
            >
                <Text style={styles.text}>settings<Icon name="setting" size={15} color="white" /></Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, globalStyles.button[mode]]}
            >
                <Text style={styles.text}>Log out<Icon name="logout" size={15} color="white" /></Text>
            </TouchableOpacity>
            <Settings mode={mode} modalVisible={modalVisible} hideModal={hideSettings} />
        </View>
    );    
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        flexDirection: "row",
        top: 10,
        right: 10,
        position: "absolute"
    },
    button: {
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: 100,
        marginLeft: 10,
    },
    text: {
        color: "white",
    },
    icon: {
        width: 10,
    }
});


export default Navigations;