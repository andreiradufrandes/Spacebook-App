import React, { Component } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { FlatList } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// todo
// change friends so that it applies only to accepted ones
// can't like posts
// only delete your posts
// present the button ONLY if its your own post
// CHECK THAT THE USER ID IS CORRECT
// this.props.route.params
// update post
// make all of them scrolable
// make sure it works with 0 friends( the looping through) when it comes to checking if someone is a friend
// move small stuff outside the component did mount into individual functions(like check friend for instance)
// error for haing multiple users with same name

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userInfo: [],
      userPosts: [], // not sure, might be diferent type
      loggedUserId: "", // WARNING - THIS IS THE ASYNC ONLY - MAYBE DELETE
      newPostText: "",
      postaddedWindow: "",
      isLoggedInUsersProfile: true,
      profileVisitorId: "",
      isFriend: false,
      // change to false when you have to
      friendsList: [],
    };
  }

  //   Careful it uses async ( so it will get my id not someone elses)
  getListOfFriends = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    const userId = await AsyncStorage.getItem("@id");
    console.log(value);

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + userId + "/friends",
      {
        headers: {
          "X-Authorization": value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendsList: responseJson,
        }),
          console.log("List of friend from getListOfFriend: ");
        console.log(this.state.friendsList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // write a function that sets isFriend to no if it's not a friend
  // ONLY call this function IF isMyProfile == false
  checkUserIsFriend = async () => {
    await this.getListOfFriends();

    this.state.friendsList.forEach((element) => {
      console.log(element.user_id + " " + this.props.route.params);

      if (element.user_id == this.props.route.params) {
        this.state.isFriend = true;
        console.log("yes the person is your friend!");
      }
    });
    console.log("inside checkuserisfriend");
    console.log(
      "isLoggedInUsersProfile: " +
        this.state.isLoggedInUsersProfile +
        ", isFriend: " +
        this.state.isFriend
    );
  };

  componentDidMount = async () => {
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      this.state.userPosts = []; // refresh it
      let userCheck = this.props.route.params;

      // 1: Determine if it's my profile or someone's else
      if (typeof userCheck === "undefined") {
        this.state.isLoggedInUsersProfile = true;
      } else {
        this.state.isLoggedInUsersProfile = false;
        this.state.profileVisitorId = this.props.route.params;
      }
      console.log("My profile: " + this.state.isLoggedInUsersProfile); // delete

      // Determine if the user is friend or not
      if (!this.state.isLoggedInUsersProfile) {
        await this.checkUserIsFriend();
      }

      // At this point botg isLoggedInUsersProfile and iffriend should be determined
      console.log(
        "inside componenet did mount AFTER calling the checkuserisfriend: " +
          this.state.isLoggedInUsersProfile +
          ", isFriend: " +
          this.state.isFriend
      );

      this.getUserInfo();
      this.getUserPosts();
      // Get the list of friends for the user that is logged in
      // maybe delete later
    });

    this.getUserInfo();
    console.log(
      "OUTSIDE event listener, isLoggedInUsersProfile: " +
        this.state.isLoggedInUsersProfile
    );

    if (this.state.isLoggedInUsersProfile) {
      this.getUserPosts();
    }

    // this.state.isLoading = false; // not sure if its correct like this
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  getUserInfo = async () => {
    // Store user id
    // IMPORTANT, await waits to get the item first
    const userId = await AsyncStorage.getItem("@id");
    const value = await AsyncStorage.getItem("@session_token");

    return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
      headers: {
        "X-Authorization": value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.setState({
          userInfo: responseJson,
        }),
          console.log(this.state.userInfo); // delete
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUserPosts = async () => {
    console.log("get users posts has been called!");
    if (this.state.isLoggedInUsersProfile) {
      // delete

      const userId = await AsyncStorage.getItem("@id");
      const value = await AsyncStorage.getItem("@session_token");
      console.log(userId);
      console.log(value);

      return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/post", {
        headers: {
          "X-Authorization": value,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw "Something went wrong";
          }
        })
        .then((responseJson) => {
          this.setState({
            //   NOT sure if we need this here
            isLoading: false, // meaning it finished and now you can display it
            userPosts: responseJson,
          }),
            console.log(this.state.userPosts);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  likePost = async (post_id, user_id) => {
    const value = await AsyncStorage.getItem("@session_token");
    console.log(post_id, user_id);

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" +
        user_id +
        "/post/" +
        post_id +
        "/like",
      {
        method: "post",
        headers: {
          "X-Authorization": value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.getUserPosts();
          //   return response.json(); // not sure of this
          console.log("Post liked:");
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deletePost = async (post_id, user_id) => {
    const value = await AsyncStorage.getItem("@session_token");
    console.log(post_id, user_id);

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id,
      {
        method: "delete",
        headers: {
          "X-Authorization": value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log("post deleted"); // delete this
          this.getUserPosts();
          //   return response.json();
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   TODO
  // CHANGE SO THAT IT POSTS ON THE RIGHT PERSONS PROFILE
  addNewPost = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    let post_to_send = {};
    post_to_send["text"] = this.state.newPostText;

    console.log("post format: " + JSON.stringify(post_to_send));
    // CHANGE FOR OTHER USERS
    const id = await AsyncStorage.getItem("@id");
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: "post",
      headers: {
        "content-type": "application/json",
        "X-Authorization": value,
      },
      body: JSON.stringify(post_to_send),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log("Post created");
          this.getUserPosts();
          this.state.newPostText = "";
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    // check the id's are the same
    // const userId = await AsyncStorage.getItem("@id");

    // const renderUpdateButton = () => {
    // if(this.props.route.params.userId == null)
    // {

    // }
    // else(this.state.asyncUserId == this.props.route.params.userId) {
    //         return (
    //           <Button
    //             title="Update details"
    //             onPress={() => this.props.navigation.navigate("Update")}
    //           />
    //         );
    //       }
    //     };

    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading..</Text>
        </View>
      );
    } else {
      return (
        //   main view
        <View>
          {/* header */}
          <View>
            <Text> Placeholder for image</Text>
            <Text> Displaying async id test: {this.userId} </Text>

            {/* only display IF my profile */}

            {/* {renderUpdateButton()} */}
            <Button
              title="Update details"
              onPress={() => this.props.navigation.navigate("Update")}
              // Take me to the
            />

            <Text>
              {this.state.userInfo.first_name +
                " " +
                this.state.userInfo.last_name}
            </Text>
            <Text>{this.state.userInfo.email}</Text>
            <Text> {this.state.userInfo.friend_count + " friends"}</Text>
            <Button
              title="See list of friends"
              onPress={() => this.props.navigation.navigate("Friends")}
            ></Button>
            {/* add post view  */}
            <View>
              <TextInput
                placeholder="Add post.."
                onChangeText={(newPostText) => this.setState({ newPostText })}
                value={this.state.newPostText}
              />
              <Button
                //  TODO
                //  This changes if it's on someone else's profile
                title="Add post(not coded) ADD INPUT AND MAKE IT ONE ELEMENT TO BE ABLE TO GET THE CONTENT"
                onPress={() => this.addNewPost()}
              />
            </View>
          </View>
          {/* body/ wall */}
          <View style={Styles.wall}>
            <FlatList
              // ADD THE POSTS
              // POPULATE WITH POST CUSTOME COMPONENT
              data={this.state.userPosts}
              keyExtractor={(item) => item.post_id}
              renderItem={({ item }) => (
                <View>
                  <Text> {item.text} </Text>
                  <Text>
                    {" "}
                    From: {item.author.first_name} {item.author.last_name}{" "}
                  </Text>
                  <Text> Posted at {item.timestamp} </Text>
                  <Text> Likes: {item.numLikes}</Text>
                  <Button title="Visit use'rs page NOT CODED" />
                  <Button
                    title="Like post(not sure if the right one is liked)"
                    onPress={() =>
                      this.likePost(item.post_id, item.author.user_id)
                    }
                  />

                  <Button
                    title="Delete post(complete)"
                    onPress={() =>
                      this.deletePost(item.post_id, item.author.user_id)
                    }
                  />
                  <Button title="Update post(complete)" />
                </View>
              )}
              // keyExtractor = {item=>item.id}
            />
          </View>
        </View>
      );
    }
  }
}

export default ProfileScreen;

const Styles = StyleSheet.create({
  wall: {
    backgroundColor: "233232",
  },
});
