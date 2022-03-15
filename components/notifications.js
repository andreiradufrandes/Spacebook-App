import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
To implement 
- button for accepting request IF they're not my friend
- add scrollview to notifications
- wait when you sign it and show notification if the signup process worked OR log them directly
- maybe add back button
- maybe take user to that person's profile after accepting them
- add is loading to all pages(maybe)
*/

class NotificationsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendsRequests: [],
      likes: [],
      friendsList: [],
      modalVisible: false,
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  componentDidMount() {
    // Event listener
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      console.log('n\n\n\n\n\n\nEvent listenern\n\n\n\n\n');
      this.getFriendRequests();
    });
  }

  componentWillUnmount() {
    // this.getFriendRequests();
    this.unsubscribe();
  }

  getFriendRequests = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    console.log(value);

    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          friendsRequests: responseJson,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  acceptFriendRequest = async (id) => {
    // how to get the exact id i need
    console.log(id);
    const value = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + id, {
      method: 'post',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          this.getFriendRequests();
          this.state.errorMessage = 'Frind request accepted!';
          this.setModalVisible(true);
        } else if (response.status === 404) {
          this.state.errorMessage =
            'Something went wront! Try logging out and back in before attempting it again';
          this.setModalVisible(true);
        } else if (response.status === 401) {
          this.state.errorMessage =
            'Unauthorised! Try logging out and then back in before attempting it again!';
          this.setModalVisible(true);
        } else if (response.status === 500) {
          this.state.errorMessage =
            'Server error! Restart the server then try again';
          this.setModalVisible(true);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  declineFriendRequest = async (id) => {
    console.log(id);
    const value = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + id, {
      method: 'delete',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          this.getFriendRequests();
          this.state.errorMessage = 'Friend request declined!';
          this.setModalVisible(true);
        } else if (response.status === 404) {
          this.state.errorMessage =
            'Something went wront! Try logging out and back in before attempting it again';
          this.setModalVisible(true);
        } else if (response.status === 401) {
          this.state.errorMessage =
            'Unauthorised! Try logging out and then back in before attempting it again!';
          this.setModalVisible(true);
        } else if (response.status === 500) {
          this.state.errorMessage =
            'Server error! Restart the server then try again';
          this.setModalVisible(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { modalVisible } = this.state;
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading..</Text>
        </View>
      );
    } else {
      return (
        <ScrollView>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {/* <Text style={styles.modalText}>Hello World!</Text> */}
                  {/* Display the erro you wish to display to the user */}
                  <Text style={styles.modalText}>
                    {this.state.errorMessage}{' '}
                  </Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Ok</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => this.setModalVisible(true)}
          >
            <Text style={styles.textStyle}>Show Modal</Text>
          </Pressable> */}
          </View>
          <View>
            <FlatList
              data={this.state.friendsRequests}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item }) => (
                <View>
                  <Text>
                    Friend request from {item.first_name} {item.last_name}
                  </Text>
                  <Button
                    title="Visit user's profile"
                    onPress={() =>
                      this.props.navigation.navigate('Profile', {
                        user_id: item.user_id,
                      })
                    }
                    //   this.props.navigation.navigate("Profile", userId); // can probably get tid of this later
                  />

                  <Button
                    title="Accept friend request"
                    onPress={() => {
                      this.acceptFriendRequest(item.user_id);
                      this.props.navigation.navigate('Profile', {
                        user_id: item.user_id,
                      });
                    }}
                  />
                  <Button
                    title="Decline friend request"
                    onPress={() => this.declineFriendRequest(item.user_id)}
                  />
                </View>
              )}
            />
          </View>
        </ScrollView>
      );
    }
  }
}
export default NotificationsScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
