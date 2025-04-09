import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import HomeScreen from '../screens/HomePage';
import ResultsScreen from '../screens/Results';
import CircuitMap from '../screens/Circuit';
import RealTimePage from '../screens/RealTime';
import TeamRadio from '../screens/TeamRadio';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Drivers"
        screenOptions={{
          tabBarActiveTintColor: 'red', // Active tab color
          tabBarInactiveTintColor: 'gray', // Inactive tab color
          tabBarStyle: {
            position: 'absolute', // Make the tab bar floating
            bottom: 20, // Adjust the position from the bottom of the screen
            borderRadius: 30, // Round corners of the tab bar
            elevation: 5, // Add shadow for the floating effect
            backgroundColor: '#fff', // Tab bar background color
            height: 60, // Tab bar height
            marginHorizontal: 10, // Adds left and right margin
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
        }}
      >
        <Tab.Screen
          name="Drivers"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialDesignIcons name="human" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialDesignIcons name="flag-checkered" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Circuit Live"
          component={CircuitMap}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialDesignIcons name="steering" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Real Time"
          component={RealTimePage}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialDesignIcons name="car-sports" size={size} color={color} />
            ),
          }}
        />

      <Tab.Screen
          name="Team Radio"
          component={TeamRadio}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialDesignIcons name="volume-high" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
