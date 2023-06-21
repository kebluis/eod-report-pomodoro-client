import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "../../environment";
import { AuthContext } from "../store/AuthContext";
import axios from "axios";
import globalStyles from "../css/global";
import { POMODORO } from "../constants/global";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { token, storeToken, isAuthenticated, userInfo, storeUserInfo } = useContext(AuthContext);

  const { configIosClientId, configWebClientId, configAndroiClientId, backEndApi } =
    getEnvVars();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: configWebClientId, // Your Expo client ID for Google Sign-In
    iosClientId: configIosClientId, // Your iOS client ID for Google Sign-In
    androidClientId: configAndroiClientId, // Your Android client ID for Google Sign-In
    scopes: ['openid', 'profile', 'email']
  });

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    await AsyncStorage.removeItem("@user");
    const user = await getLocalUser();
    if (!user) {
      if (response?.type === "success") {
        await storeToken(response.params.id_token);
        await AsyncStorage.setItem(
          "@token",
          response.params.id_token
        );
        // isAuthenticated(!!response.params.id_token);
      }
    }

    if (response) {
      await getUserInfo();
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async () => {
    if (!token) return;
    try {
      // const response = await fetch(
      //   `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
      // );

      // const user = await response.json();
      // await AsyncStorage.setItem("@user", JSON.stringify(user));
      // isAuthenticated(!!user)
      await axios.get(backEndApi + 'user',
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      ).then(async response => {
        console.log('user response', response.data);
        await storeUserInfo(response.data);
        await isAuthenticated(!!token);
      }).catch(error => {
        console.log('error on user:', error);
      });
      // await setUserInfo();
    } catch (error) {
      console.error(error);
    }
  };

  // const setUserInfo = async () => {
  // }

  // const getUserSettings = async user => {
  //   console.log('pota', user, token);
  //   await axios.get(backEndApi + 'user-settings/' + user.id, {
  //       headers: {
  //           Authorization: "Bearer " + token
  //       }
  //   })
  //   .then(async response => {
  //       console.log('settings', response.data);
  //       let newData = {
  //         settings: response.data,
  //         user: user
  //       };
  //       await storeUserInfo(newData);
  //   }).catch(error => {
  //     console.log('error on setttings:', error);
  //   });
  // }

  return (
    <View style={[styles.container, globalStyles.containerBg[POMODORO]]}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={() => {
                promptAsync();
              }}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '80%',
  },
  googleButton: {
    backgroundColor: '#db4437',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

