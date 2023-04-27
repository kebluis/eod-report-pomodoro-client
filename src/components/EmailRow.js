import React from 'react';
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import Icon from "@expo/vector-icons/AntDesign";


const EmailRow = ({item, index, removeEmail, theme}) => (
    <View key={index} style={styles.container}>
        <Text style={[styles.emailListText, styles[theme]]}>
            {item.email}
        </Text>
        <TouchableOpacity onPress={() => {removeEmail(index)}} style={styles.emailRemove}>
            <Text><Icon name="deleteuser" size={25} color="white" /></Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap:'wrap',
        height: 50,
        width: "100%",
        textAlign: "left"
    },
    emailList: {
        flexDirection:'column',
        flexWrap:'wrap',
    },
    pomodoroTheme: {
        backgroundColor: "#c15c5c",
        color: "white"
    },
    breakTheme: {
        backgroundColor: "#82b5f0",
        color: "white",
    },
    emailListText: {
        width: "100%",
        fontSize: 20,
    },
    emailRemove: {
        paddingTop: 15,
        right: 0,
        top: -15,
        position: "absolute",
    },
});

export default EmailRow;