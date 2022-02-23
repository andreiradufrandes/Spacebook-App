import React, { Component } from 'react';
import { View, Text, TextInput,Button, Alert,StyleSheet } from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';




class PracticeScreen extends Component {

    constructor(props){
        super(props);
    
        this.state = {
          isLoading: true,
        //   LIST DATA CONTAINS  ALL THE USERS IN THE LIST
          listData: []

        }
      }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        })
        this.getData();
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      } 


  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id'); // store the id 
    return fetch("http://localhost:3333/api/1.0.0/search", {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson,
          });
          console.log(this.state.listData);
          console.log("id: " + id);
          console.log("token:"  + value);
        })
        .catch((error) => {
            console.log(error);
        })
  }



  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };




    render(){
      return (
        //   main view 
        <View >
            {/* header */}
            <View> 
                <Text> Placeholder for image</Text> 
                <Button
                    title='Update details'
                />
                <Text> First name Last Name</Text>
                
                <Text> Friends(REPLACE) : 
                    
                </Text> 

                <Button
                    title='Notificatins'
                    // TODO
                    // TAKE USER TO NOTIFICATION SCREEN
                    // HAVE FRIEND REQUESTS THERE
                />
                <Button
                    title='Add post'
                />
                

            </View>
            {/* body/ wall */}
            <View style={Styles.wall}>
                {/* wrapped in a flatlist */}
                
                <Text> Individual custome POST components which get the info from the user </Text>
                <Text> Individual custome POST components which get the info from the user </Text>
                <Text> Individual custome POST components which get the info from the user </Text>
                <Text> Individual custome POST components which get the info from the user </Text>
                
                <FlatList
                    // ADD THE POSTS 
                    // POPULATE WITH POST CUSTOME COMPONENT
                    
                />

            </View>
        </View>
      );
    } 
}





export default PracticeScreen;


const Styles = StyleSheet.create({
    wall:{
        backgroundColor: "233232",
    }

})