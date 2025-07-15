import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Home from '../../screens/HomePage';
import AboutPage from '../../screens/About';
import RawMaterialScreen from '../../screens/RawMaterial';
import Profile from '../../screens/Profile';
import ServiceRequest from '../../screens/ServiceRequest';
import Cart from '../../screens/Cart';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = focused ? size + 2 : size;
          
          switch (route.name) {
            case 'Home':
              return <Icon name="home" size={iconSize} color={color} />;
            case 'About':
              return <MaterialIcon name="person-search" size={iconSize} color={color} />;
            case 'Raw Materials':
              return <Icon name="opencart" size={iconSize} color={color} />;
            case 'Profile':
              return <Icon name="user" size={iconSize} color={color} />;
            case 'Service':
              return <AntDesignIcon name="customerservice" size={iconSize} color={color} />;
            case 'Cart':
              return <Icon name="shopping-cart" size={iconSize} color={color} />;
            default:
              return null;
          }
        },
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="About" 
        component={AboutPage} 
        options={{ tabBarLabel: 'About' }}
      />
      <Tab.Screen 
        name="Raw Materials" 
        component={RawMaterialScreen}
        options={{ tabBarLabel: 'Materials' }}
      />
      <Tab.Screen 
        name="Service" 
        component={ServiceRequest}
        options={{ tabBarLabel: 'Service' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={Cart}
        options={{ tabBarLabel: 'Cart' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    marginBottom: 0,
    fontWeight: '500',
  },
});

export default TabNavigator;