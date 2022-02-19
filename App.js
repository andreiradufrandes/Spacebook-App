import * as React from 'react';
import { View, Text,Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



// Set up the screen component
//  the navigation prop is passed in to every screen component (definition) in the native stack navigator
function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>

      {/* navigate to the details screen */}
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />


    </View>
  );
}
// details screen
function DetailsScreen({navigation}) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
        title="Go to Home"
        onPress={() =>navigation.navigate('Home')}
      />
        <Button 
         title="Go back" 
         onPress={() => navigation.goBack()} 
        />
      </View>
    );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    // we wrap the whole nagivation in a navigation container 
    
    <NavigationContainer>
        {/* The order in which we put them is the order in which they appear */}
      <Stack.Navigator>
          {/* specify a route using the screen component*/}
        <Stack.Screen
         name="Home" 
         component={HomeScreen} 
         options={{ title: 'Home' }}
         />
        <Stack.Screen 
         name="Details" 
         component={DetailsScreen} 
         options={{ title: 'Details Screen ' }}
         />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;