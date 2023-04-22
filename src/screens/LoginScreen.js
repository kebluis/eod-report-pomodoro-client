import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { StatusBar } from 'expo-status-bar';
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {

  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState();
  const [auth, setAuth] = useState();
  const [requireRefresh, setRequireRefresh] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId : "284995461368-cvahknrvv83u60p8vllra5613drru6c9.apps.googleusercontent.com",
    androidClientId : "284995461368-e8dl207qnqmjt52riceovps615i880h1.apps.googleusercontent.com",
    iosClientId : "284995461368-b2qvvlvmqf6qacdl0ponojmf45567j9t.apps.googleusercontent.com"
  });

  useEffect(() => {
    // console.log(response?.authentication);
    if (response?.type === "success") {
      // setAccessToken(response.authentication.accessToken);
      // accessToken && getUserData();
      console.log(response);
      setAuth(response.authentication);

      const persistAuth = async () => {
        await AsyncStorage.setItem("auth", JSON.stringify(response.authentication));
      };
      persistAuth();
    }
  }, [response]);

  useEffect(() => {
    const getPersistedAuth = async () => {
      const jsonValue = await AsyncStorage.getItem("auth");
      if (jsonValue != null) {
        const authFromJson = JSON.parse(jsonValue);
        setAuth(authFromJson);
        // console.log(authFromJson);

        setRequireRefresh(!AuthSession.TokenResponse.isTokenFresh({
          expiresIn: authFromJson.expiresIn,
          issuedAt: authFromJson.issuedAt
        }));
      }
    };
    getPersistedAuth();
  }, []);

  const getUserData = async () => {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    });

    userInfoResponse.json().then(data => {
      console.log(data);
      setUserInfo(data);
    });
  };

  const showUserData = () => {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          {/* <Image source={{ uri: userInfo.picture }} style={styles.profilePic} /> */}
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
      console.log(userInfo);
    }
  };

  const getClientId = () => {
    if (Platform === undefined){
      return "284995461368-cvahknrvv83u60p8vllra5613drru6c9.apps.googleusercontent.com";
    }
    else {
      if (Platform?.OS === "ios") {
        return "284995461368-b2qvvlvmqf6qacdl0ponojmf45567j9t.apps.googleusercontent.com";
      } else if (Platform?.OS === "android") {
        return "284995461368-e8dl207qnqmjt52riceovps615i880h1.apps.googleusercontent.com";
      } else {
        return "284995461368-cvahknrvv83u60p8vllra5613drru6c9.apps.googleusercontent.com";
      }
    }
  }

  const refreshToken = async () => {
    const clientId = getClientId();
    console.log(auth.refreshToken);
    const tokenResult = await AuthSession.refreshAsync({
      clientId: clientId,
      refreshToken: auth.refreshToken
    }, {
      tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token"
    });

    tokenResult.refreshToken = auth.refreshToken;

    setAuth(tokenResult);
    await AsyncStorage.setItem("auth", JSON.stringify(tokenResult));
    setRequireRefresh(false);
  };

  const logout = async () => {
    console.log("Logged Out");
    setRequireRefresh(false);

    await AuthSession.revokeAsync({
      token: auth.accessToken
    }, {
      revocationEndpoint: "https://oauth2.googleapis.com/revoke"
    });

    setAuth(undefined);
    setUserInfo(undefined);
    await AsyncStorage.removeItem("auth");
  };

  if (requireRefresh) {
    return (
      <View style={styles.container}>
        <Text>Token requires refresh...</Text>
        <Button title="Refresh Token" onPress={refreshToken} />
        <Button title="Logout" onPress={logout} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {showUserData()}
      <Button 
        title={auth ? "Get User Data": "Login"} 
        onPress={auth ? getUserData : () => promptAsync({ useProxy: false })}
      />
      {auth ? <Button title="Logout" onPress={logout} /> : undefined}
      {/* <Button title="Logout" onPress={logout} /> */}
      <StatusBar style="auto" />
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 50,
    height: 50
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default LoginScreen;
