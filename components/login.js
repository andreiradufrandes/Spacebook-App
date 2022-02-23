import React, { Component } from 'react';
import { View, Text, TextInput,Button, StyleSheet,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import TextInjection from 'react-native/Libraries/Text/TextInjection';

const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@spacebook_details', jsonValue)
    } catch (e) {
        console.error(e);
    }
}


class LoginScreen extends Component {


    constructor(props){
        super(props);
        this.state = {
            email: "andreifrandes@mmu.ac.uk",
            password: "andreifrandes"
        };
    }

        
        login = async () => {

    
            return fetch("http://localhost:3333/api/1.0.0/login", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 400){
                    throw 'Invalid email or password';
                }else{
                    throw 'Something went wrong';
                }
            })
            .then(async (responseJson) => {
                    console.log(responseJson);
                    console.log("token is " + responseJson.token);
                    await AsyncStorage.setItem('@session_token', responseJson.token);
                    await AsyncStorage.setItem('@id',responseJson.id)
                    console.log("id: " + AsyncStorage.getItem('@id'));
                    this.props.navigation.navigate("Practice");  // change this to main
            })
            .catch((error) => {
                console.log(error);
            })
        }
    

    render(){


        const navigation = this.props.navigation;

        return(
            <View style={style.container}>
            <TextInput 
                style={style.input}
                placeholder="email"
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
            />
            <TextInput
                style={style.input}
                placeholder="password"
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                secureTextEntry={true}
            />
            <Button
                style={style.Button}
                title="LOGIN"
                onPress={() => this.login()}
            />
            

            <Button 
                style={style.Button}
                title='Sign up page'
                onPress={() => navigation.navigate('Signup')}
            />

        {/* Get rid of the main page button  */}
            <Button 
                style={style.Button}
                title='Main page'
                onPress={() => navigation.navigate('Main')}
            />
            
            <Button 
                style={style.Button}
                title='Profile'
                onPress={() => navigation.navigate('Profile')}
            />
         </View>    
        )
    }
}

export default LoginScreen;




// TODO
// Delete some of this, and add it to css component outside of this


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'column',
        
      },
      input: {
        backgroundColor: "#edf7ff",
        borderRadius: 10,
        height: 50,
        // flex: 1,
        padding: 10,
        marginBottom: 20,
      },
      Button:{
          marginBottom:50,
      }

})