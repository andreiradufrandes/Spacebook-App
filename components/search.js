import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
TODO 
- Display only if the list is not empty of something
- fix the search to show LIMITED number of searches 


*/

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      searchResults: [],
    };
  }

  //   ADD LIMIT TO THE FETCH RESULT, AND MAKE IT LOOK LIKE THE REAL ONE
  searchName = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    console.log(value);

    return fetch(
      'http://localhost:3333/api/1.0.0/search?q=' + this.state.searchTerm,
      {
        headers: {
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        // save the users info inside the state
        this.setState({
          isLoading: false, // meaning it finished and now you can display it
          searchResults: responseJson,
        }),
          console.log(this.state.searchResults); // delete later
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    //
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* 37 friend now but ill remove him */}
        <Button
          title="take me to someone's profile(write id by hand)"
          onPress={() =>
            this.props.navigation.navigate('Profile', {
              user_id: 37,
            })
          }
        />
        <Button
          title="take me to Andrei's profile"
          onPress={() => this.props.navigation.navigate('Profile', 17)}
        />
        <Text> Search for people or friends</Text>
        <TextInput
          style={styles.input}
          placeholder="search"
          onChangeText={(searchTerm) => this.setState({ searchTerm })}
          value={this.state.searchTerm}
        />
        <Button title="search" onPress={() => this.searchName()} />

        {/* {true ? <Button title="Hi" /> : <Button title="Bye" />} */}

        <FlatList
          data={this.state.searchResults}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.user_givenname} {item.user_familyname}
              </Text>
              <Button
                title="Visit Profile WITH OBJECT PASSED "
                onPress={() =>
                  this.props.navigation.navigate('Profile', {
                    user_id: item.user_id,
                  })
                }
                //   this.props.navigation.navigate("Profile", userId); // can probably get tid of this later
              />
            </View>
          )}
        />
      </View>
    );
  }
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  input: {
    backgroundColor: '#edf7ff',
    borderRadius: 10,
    height: 50,
    // flex: 1,
    padding: 10,
    marginBottom: 20,
  },
  Button: {
    marginBottom: 50,
  },
});
