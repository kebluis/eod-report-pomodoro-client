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
    const { serviceSelected, userSettings, storeUserSettings } = useContext(ServiceContext);
    const { backEndApi } = getEnvVars();
    const { token } = useContext(AuthContext);
    const [toEmailType, setToEmailType] = useState("to");
    const [toEmail, setToEmail] = useState("");
    const [emails, setEmails] = useState((userSettings?.email || []));
    const [pomotime, setPomoTime] = useState(userSettings?.pomodoroTime || '');
    const [shorttime, setShortTime] = useState(userSettings?.shortBreak || '');
    const [longtime, setLongTime] = useState(userSettings?.longBreak || '');

    const addEmail = email => setEmails([...emails, email]);

    const removeEmail = indexToRemove => {
        let tempEmails = emails.filter((value, index) => {
            return index !== indexToRemove;
        });

        setEmails(tempEmails);
    }

    console.log('settings are', userSettings);

    const addEmailToList = () => {
        // todo: validate email

        if (toEmail.length) {
            const email = {
                emailAddress: toEmail,
                emailType: toEmailType,
                userSettings: userSettings.id
            };

            addEmail(email);
        }

        setToEmail("");
    }

    const updateSettings = async () => {
        await axios.put(backEndApi + 'user-settings/' + userSettings.id,
            {
              email: emails,
              id: userSettings.id,
              longBreak: longtime,
              pomodoroTime: pomotime,
              shortBreak: shorttime,
              userId: userSettings.user.id
            },
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        )
        .then(async response => {
            console.log('settings updated: ', response.data);
            await storeUserSettings(response.data);
            hideModal();
        }).catch(error => {
            console.log('error on setttings:', error);
        });
    }

    return (
        <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => {
                hideModal(false);
            }}
        >
            <View style={[styles.container, globalStyles.containerBg[serviceSelected]]}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Settings</Text>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.containerBg[serviceSelected]}>Pomodoro</Text>
                        <TextInput
                            style={[styles.timerInput, globalStyles.containerBg[serviceSelected]]}
                            placeholder="pomodoro timer"
                            defaultValue={userSettings?.pomodoroTime?.toString()}
                            placeholderTextColor="white"
                            onChangeText={value => setPomoTime(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.containerBg[serviceSelected]}>Short break</Text>
                        <TextInput
                            style={[styles.timerInput, globalStyles.containerBg[serviceSelected]]}
                            defaultValue={userSettings?.shortBreak?.toString()}
                            placeholder="short timer"
                            placeholderTextColor="white"
                            onChangeText={value => setShortTime(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.containerBg[serviceSelected]}>Long break</Text>
                        <TextInput
                            style={[styles.timerInput, globalStyles.containerBg[serviceSelected]]}
                            defaultValue={userSettings?.longBreak?.toString()}
                            placeholder="long timer"
                            placeholderTextColor="white"
                            onChangeText={value => setLongTime(value)}
                        />
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <View>
                        <Text style={globalStyles.containerBg[serviceSelected]}>Emails to send to:</Text>
                    </View>
                    <View style={styles.emailList}>
                        <FlatList
                            data={emails}
                            renderItem={({item, index}) => <EmailRow theme={serviceSelected} item={item} index={index} removeEmail={removeEmail}
                            keyExtractor={({item, index}) => index}
                        />}
                        />
                    </View>
                    <View style={styles.emailInputContainer}>
                        <TextInput
                            style={[styles.email, globalStyles.containerBg[serviceSelected]]}
                            placeholder="email"
                            onChangeText={setToEmail}
                            value={toEmail}
                            placeholderTextColor="white"
                        />
                        <Picker
                            style={[styles.toDropDown, globalStyles.containerBg[serviceSelected]]}
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
                    <Pressable style={[styles.button, globalStyles.button[serviceSelected]]} onPress={updateSettings}>
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
