import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Profile from './screens/Profile';
import Home from './screens/HomePage';
import RawMaterialScreen from './screens/RawMaterial';
import ServiceRequest from './screens/ServiceRequest';
import Contact from './screens/Contact'; // Import Contact screen
import ProfilePage from './screens/About';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Create Stack

// Define the Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <FontAwesome name={iconName} size={size} color={color} />;
          } 
          else if (route.name === 'About') {
            iconName = 'person-search';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          }else if (route.name === 'Raw Materials') {
            iconName = 'opencart';
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = 'user';
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === 'Service') {
            iconName = 'customerservice';
            return <AntDesign name={iconName} size={size} color={color} />;
          }
          
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="About" component={ProfilePage} options={{ headerShown: false }} />
      <Tab.Screen name="Raw Materials" component={RawMaterialScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Service" component={ServiceRequest} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Define the Stack Navigator with TabNavigator and Contact
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Contact" component={Contact} options={{ title: 'Contact Support' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
