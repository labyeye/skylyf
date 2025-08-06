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
import Checkout from '../../screens/Checkout';
import PaymentWebView from '../../screens/PaymentWebView';
import PaymentSuccess from '../../screens/PaymentSuccess';
import PaymentFailure from '../../screens/PaymentFailure';
import OrderHistory from '../../screens/OrderHistory';
import OrderDetails from '../../screens/OrderDetails';
import PaymentMethods from '../../screens/PaymentMethods';
import MyAddresses from '../../screens/MyAddresses';
import PayUTestScreen from '../../screens/PayUTestScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="Login" component={LoginScreen} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="Register" component={RegisterScreen} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={TabNavigator} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="Cart" component={Cart} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="EditProfile" component={EditProfileScreen} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="BillDetails" component={BillDetails} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="Checkout" component={Checkout} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="PaymentWebView" component={PaymentWebView} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="PaymentFailure" component={PaymentFailure} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="OrderHistory" component={OrderHistory} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="OrderDetails" component={OrderDetails} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="MyAddresses" component={MyAddresses} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="PayUTestScreen" component={PayUTestScreen} screenOptions={{ headerShown: false }}/>
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;