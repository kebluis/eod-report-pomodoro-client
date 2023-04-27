import React, {useState, useContext} from 'react';
import {Modal, StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from "@expo/vector-icons/AntDesign";
import { ServiceContext } from "../store/ServiceContext";
import globalStyles from "../css/global";

const Settings = ({modalVisible, hideModal}) => {
    const [toEmailType, setToEmailType] = useState("to");
    const [toEmail, setToEmail] = useState("");
    const [emails, setEmails] = useState([
        // sample default email
        // TODO: add integration for fetching  settings/emails
        {
            email: 'sample@gmail.cm',
            type: 'to'
        },
        {
            email: 'sample2@gmail.cm',
            type: 'cc'
        }

    ]);
    const { isBreak } = useContext(ServiceContext);
    const mode = isBreak ? 'break' : 'pomo';

    const addEmail = email => {
        let tempEmails = [...emails];
        tempEmails.push(email);
        setEmails(tempEmails);
    };

    const removeEmail = indexToRemove => {
        let tempEmails = emails.filter((value, index) => {
            return index !== indexToRemove;
        });

        setEmails(tempEmails);
    }

    const addEmailToList = () => {
        // todo: validate email

        if (toEmail.length) {
            let email = {
                email: toEmail,
                type: toEmailType
            };

            addEmail(email);
        }

        setToEmail("");
    }

    const emailList = emails.map((value, index) => (
        <View key={index} style={{
        flexDirection:'row',
        flexWrap:'wrap',
        height: 50,
        width: "100%",
        textAlign: "left"
    }}>
            <Text style={[{width: "100%", fontSize: 20}, globalStyles.containerBg[mode]]}>
                {value.email}
            </Text>
            <TouchableOpacity onPress={() => {removeEmail(index)}} style={{paddingTop: 15, right: 0, top: -15, position: "absolute"}}>
                <Text><Icon name="deleteuser" size={25} color="white" /></Text>
            </TouchableOpacity>
        </View>
    ));

    // TODO add submit button for API integration
    return (
        <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => {
                hideModal(false);
            }}
        >
            <View style={[styles.container, globalStyles.containerBg[mode]]}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Settings</Text>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.containerBg[mode]}>Pomodoro</Text>
                        <TextInput style={[styles.timerInput, globalStyles.containerBg[mode]]} placeholder="pomodoro timer" placeholderTextColor="white" />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.containerBg[mode]}>Short break</Text>
                        <TextInput style={[styles.timerInput, globalStyles.containerBg[mode]]} placeholder="break timer" placeholderTextColor="white" />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.containerBg[mode]}>Long break</Text>
                        <TextInput style={[styles.timerInput, globalStyles.containerBg[mode]]} placeholder="long break timer" placeholderTextColor="white" />
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <View>
                        <Text style={globalStyles.containerBg[mode]}>Emails to send to:</Text>
                    </View>
                    <View style={styles.emailList}>
                        <Text></Text>
                        {emailList}
                    </View>
                    <View style={styles.emailInputContainer}>
                        <TextInput
                            style={[styles.email, globalStyles.containerBg[mode]]}
                            placeholder="email"
                            onChangeText={setToEmail}
                            value={toEmail}
                            placeholderTextColor="white"
                        />
                        <Picker
                            style={[styles.toDropDown, globalStyles.containerBg[mode]]}
                            selectedValue={toEmailType}
                            onValueChange={(itemValue, itemIndex) => setToEmailType(itemValue)}
                        >
                            <Picker.Item label="To" value="to" />
                            <Picker.Item label="Cc" value="cc" />
                            <Picker.Item label="Bcc" value="bcc" />
                        </Picker>
                        <TouchableOpacity onPress={addEmailToList} style={{paddingTop: 15}}>
                            <Text><Icon name="adduser" size={25} color="white" /></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        color: "white"
    },
    headerContainer: {
        borderBottomColor: "white",
        borderBottomWidth: 2,
        marginBottom: 20
    },
    headerText: {
        fontSize: 50,
        fontWeight: "bold",
        color: "white",
    },
    inputContainer: {
        width: "30%",
        margin: 5,
    },
    timerInput: {
        borderColor: "white",
        borderWidth: 2,
        padding: 10
    },
    formContainer: {
        flexDirection:'row',
        flexWrap:'wrap',
        margin: 20,
        color: "white",
    },
    emailInputContainer: {
        margin: 5,
        width: "100%",
        flexDirection:'row',
        flexWrap:'wrap',
        marginBottom: 0,
        height: 40
    },
    email: {
        borderBottomColor: "white",
        borderBottomWidth: 2,
        width: "60%",
        height: 40,
    },
    toDropDown: {
        width: 120,
        height: 40,
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
        color: "white"
    }
});

export default Settings;
