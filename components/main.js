import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import ProfileScreen from './profile';
import SearchScreen from './search';
import NotificationsScreen from './notifications';

const Tab = createBottomTabNavigator();



class MainScreen extends Component {
    render(){
      return (
        
          <Tab.Navigator>
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
          </Tab.Navigator>
        


      );
    } 
}

export default MainScreen;