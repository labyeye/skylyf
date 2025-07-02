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
import Cart from '../../screens/Cart';

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
        } else if (route.name === 'Cart') {
          return <FontAwesome name="shopping-cart" size={size} color={color} />;
        }
      },
      headerShown: false,
      tabBarActiveTintColor: '#007AFF', // Custom active tab color
      tabBarInactiveTintColor: 'gray', // Custom inactive tab color
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 4, // Adjust spacing
      },
      tabBarStyle: {
        height: 60, // Increase tab bar height
        paddingBottom: 6, // Adjust padding
      },
      tabBarItemStyle: {
        padding: 4, // Adjust item padding
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={Home} 
      options={{ tabBarLabel: 'Home' }} 
    />
    <Tab.Screen 
      name="About" 
      component={About} 
      options={{ tabBarLabel: 'About' }} 
    />
    <Tab.Screen 
      name="Raw Materials" 
      component={RawMaterialScreen} 
      options={{ tabBarLabel: 'Materials' }} // Shortened label
    />
    <Tab.Screen 
      name="Service" 
      component={ServiceRequest} 
      options={{ tabBarLabel: 'Service' }} 
    />
    <Tab.Screen 
      name="Profile" 
      component={Profile} 
      options={{ tabBarLabel: 'Profile' }} 
    />
    <Tab.Screen 
      name="Cart" 
      component={Cart} 
      options={{ 
        tabBarButton: () => null, 
        tabBarVisible: false 
      }} 
    />
  </Tab.Navigator>
);

export default TabNavigator;