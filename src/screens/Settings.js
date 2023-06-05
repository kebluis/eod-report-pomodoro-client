import React, { useContext, useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Pressable,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from "@expo/vector-icons/AntDesign";
import { ServiceContext } from "../store/ServiceContext";
import globalStyles from "../css/global";
import EmailRow from "../components/EmailRow";
import getEnvVars from "../../environment";
import axios from "axios";
import { AuthContext } from "../store/AuthContext";


const Settings = ({modalVisible, hideModal}) => {
    const { backEndApi } = getEnvVars();
    const { token, userInfo } = useContext(AuthContext);
    const [toEmailType, setToEmailType] = useState("to");
    const [toEmail, setToEmail] = useState("");
    const [emails, setEmails] = useState([]);

    const { serviceSelected } = useContext(ServiceContext);

    const mode = serviceSelected;

    const addEmail = email => setEmails([...emails, email]);

    const removeEmail = indexToRemove => {
        let tempEmails = emails.filter((value, index) => {
            return index !== indexToRemove;
        });

        setEmails(tempEmails);
    }

    useEffect(() => {
        if (userInfo?.settings?.email) {
            setEmails(userInfo.settings.email);
        }
    });

    console.log('settings are', userInfo);

    const addEmailToList = () => {
        // todo: validate email

        if (toEmail.length) {
            const email = {
                emailAddress: toEmail,
                emailType: toEmailType
            };

            addEmail(email);
        }

        setToEmail("");
    }

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
                        <TextInput style={[styles.timerInput, globalStyles.containerBg[mode]]} placeholder="pomodoro timer" value={userInfo?.settings?.pomodoroTime?.toString()} placeholderTextColor="white" />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.containerBg[mode]}>Short break</Text>
                        <TextInput style={[styles.timerInput, globalStyles.containerBg[mode]]} value={userInfo?.settings?.shortBreak?.toString()} placeholder="short timer" placeholderTextColor="white" />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.containerBg[mode]}>Long break</Text>
                        <TextInput style={[styles.timerInput, globalStyles.containerBg[mode]]} value={userInfo?.settings?.longBreak?.toString()} placeholder="long timer" placeholderTextColor="white" />
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <View>
                        <Text style={globalStyles.containerBg[mode]}>Emails to send to:</Text>
                    </View>
                    <View style={styles.emailList}>
                        <FlatList
                            data={emails}
                            renderItem={({item, index}) => <EmailRow theme={mode} item={item} index={index} removeEmail={removeEmail}
                            keyExtractor={({item, index}) => index}
                        />}
                        />
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
                        <TouchableOpacity onPress={addEmailToList} style={styles.emailAdd}>
                            <Text><Icon name="adduser" size={25} color="white" /></Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.button, styles.cancel]} onPress={hideModal}>
                        <Text>Cancel</Text>
                    </Pressable>
                    <Pressable style={[styles.button, globalStyles.button[mode]]} onPress={() => {}}>
                        <Text style={globalStyles.whiteText}>Save</Text>
                    </Pressable>
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
        marginHorizontal: 16
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
        width: "30%",
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
        color: "white",
    },
    emailAdd: {
        paddingTop: 15,
        right: 5,
        top: 0,
        position: "absolute",
    },
    buttonContainer: {
        flexDirection: "row",
        width: '100%'
    },
    button: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 24,
        marginHorizontal: 36,
        padding: 24,
        borderRadius: 10,
    },
    cancel:{
        backgroundColor: '#fff'
    },
    next: {
        backgroundColor: '#ba4949'
    }
});

export default Settings;
