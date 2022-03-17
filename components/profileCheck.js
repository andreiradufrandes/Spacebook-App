// import React, { Component } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Modal,
//   StyleSheet,
//   Alert,
//   Pressable,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// /*
// To implement
// - button for accepting request IF they're not my friend

// */

// class ProfileCheck extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       modalVisible: false,
//       count: 3,
//     };
//   }

//   // componentDidMount = async () => {
//   //   console.log('Componenet did mount');
//   //   // this.unsubscribe = this.props.navigation.addListener('focus', async () => {

//   //   this.takeUserToProfile();
//   //   this.unsubscribe = this.props.navigation.addListener('focus', async () => {
//   //     this.takeUserToProfile();
//   //   });
//   // };

//   takeUserToProfile = async () => {
//     const user_id = await AsyncStorage.getItem('@id');
//     // Take user to its own profile by passing his id as a parameter
//     console.log('User taken back to his profile!');
//     this.props.navigation.navigate('Profile', {
//       user_id: user_id,
//       // });
//     });
//   };

//   // componentWillUnmount() {
//   //   this.unsubscribe();
//   //   console.log('-----------comonentwillunmountcall----------');
//   // }
//   // componentWillUnmount() {
//   //   this.unsubscribe();
//   // }

//   setModalVisible = (visible) => {
//     this.setState({ modalVisible: visible });
//   };

//   render() {
//     // We don't need to return anything
//     // delete later
//     const { modalVisible } = this.state;

//     return (
//       <View>
//         <View style={styles.centeredView}>
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//               this.setModalVisible(!modalVisible);
//             }}
//           >
//             <View style={styles.centeredView}>
//               <View style={styles.modalView}>
//                 <Text style={styles.modalText}>Hello World!</Text>
//                 <Pressable
//                   style={[styles.button, styles.buttonClose]}
//                   onPress={() => this.setModalVisible(!modalVisible)}
//                 >
//                   <Text style={styles.textStyle}>Hide Modal</Text>
//                 </Pressable>
//               </View>
//             </View>
//           </Modal>
//           <Pressable
//             style={[styles.button, styles.buttonOpen]}
//             onPress={() => this.setModalVisible(true)}
//           >
//             <Text style={styles.textStyle}>Show Modal</Text>
//           </Pressable>
//         </View>
//         <View>
//           <Text>Delete</Text>
//           <Button
//             title="Take me to my profile"
//             onPress={() => this.takeUserToProfile()}
//           ></Button>
//         </View>
//       </View>
//     );

//     // return (

//     // );
//   }
// }

// export default ProfileCheck;

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   buttonOpen: {
//     backgroundColor: '#F194FF',
//   },
//   buttonClose: {
//     backgroundColor: '#2196F3',
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });
