import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Home from '../../screens/HomePage';
import About from '../../screens/About';
import RawMaterialScreen from '../../screens/RawMaterial';
import ServiceRequest from '../../screens/ServiceRequest';
import Profile from '../../screens/Profile';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Home') {
          return <FontAwesome name="home" size={size} color={color} />;
        } else if (route.name === 'About') {
          return <MaterialIcons name="person-search" size={size} color={color} />;
        } else if (route.name === 'Raw Materials') {
          return <FontAwesome name="opencart" size={size} color={color} />;
        } else if (route.name === 'Profile') {
          return <FontAwesome name="user" size={size} color={color} />;
        } else if (route.name === 'Service') {
          return <AntDesign name="customerservice" size={size} color={color} />;
        }
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="About" component={About} />
    <Tab.Screen name="Raw Materials" component={RawMaterialScreen} />
    <Tab.Screen name="Service" component={ServiceRequest} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);

export default TabNavigator; 