import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './components/main';
import LoginScreen from './components/login';
import SignupScreen from './components/signup';
import ProfileScreen from './components/profile'; // remove this from the file

const Stack = createNativeStackNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
          {/* Stack navigator */}
        <Stack.Navigator>   
          {/* <Stack.Screen name="Profile" component={ProfileScreen} />  remove this */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />      
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
}

export default App;