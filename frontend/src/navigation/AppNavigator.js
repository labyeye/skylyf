import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import Cart from '../../screens/Cart';
import BillDetails from '../../screens/BillDetails';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="BillDetails" component={BillDetails} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;