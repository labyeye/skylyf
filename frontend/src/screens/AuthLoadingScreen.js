import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    };
    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};

export default AuthLoadingScreen; 