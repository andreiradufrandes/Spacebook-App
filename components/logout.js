import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  Button,
  View,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      errorMessage: '',
      modalVisible: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value !== null) {
      this.setState({ token: value });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  logout = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('response code:', response.status);
          // this.state.errorMessage = 'Logout successful!';
          // this.setModalVisible(true);
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          // Delete
          // means YOURE ALREADY LOGGED OUT
          this.state.errorMessage =
            'Logout failed! This is because you are not logged in!';
          this.setModalVisible(true);
        } else if (response.status === 500) {
          this.state.errorMessage =
            'Server error! Restart the server then try again';
          this.setModalVisible(true);
        }
      })
      .catch((error) => {
        console.log(error);
        // ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  render() {
    const { modalVisible } = this.state;

    return (
      <View>
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
                <Text style={styles.modalText}>{this.state.errorMessage} </Text>
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

        <Button title="Logout" onPress={() => this.logout()} />
      </View>
    );
  }
}

export default LogoutScreen;

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
