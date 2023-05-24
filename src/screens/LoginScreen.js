import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "../../environment";
import { AuthContext } from "../store/AuthContext";

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

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      isAuthenticated(!!user)
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            promptAsync();
          }}
        >
          <Image
            source={require("../../assets/google_logo.png")}
            style={styles.logo}
          />
          <Text style={styles.text}>Sign in with Google</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  text: {
    color: "#757575",
    fontWeight: "500",
  },
});
