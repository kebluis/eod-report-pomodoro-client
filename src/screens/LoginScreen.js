import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "../../environment";
import { AuthContext } from "../store/AuthContext";
import globalStyles from "../css/global";
import { POMODORO } from "../constants/global";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { token, storeToken, isAuthenticated } = useContext(AuthContext);

  const { configIosClientId, configWebClientId, configAndroiClientId } =
    getEnvVars();

  const [userInfo, setUserInfo] = useState(null);

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
        storeToken(response.params.id_token);
        await AsyncStorage.setItem(
          "@token",
          response.params.id_token
        );
        isAuthenticated(!!response.params.id_token)
      }
    } else {
      setUserInfo(user);
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

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

