import React, { Component } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { FlatList } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Todo
// Get individual post
// 1. Write query
// 2. Pass stuff from the profile post(like the post id or whatever, to take you here )
// 3. Add did mount of whatever
// /user/{user_id}/post/{post_id}
// 4. display it
// get post_id from post when you nagivate here
// Refresh page when updated
// import delete post instead of rewriting it

class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      post: [], // maybe change this
    };
  }

  componentDidMount() {
    this.getSinglePost();
  }

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
          console.log("post deleted");
          //   Navigate user somewhere
          this.props.navigation.navigate("Profile"); // maybe add something to it
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getSinglePost = async () => {
    const userId = await AsyncStorage.getItem("@id");
    const value = await AsyncStorage.getItem("@session_token");
    let post_id = this.props.route.params;
    console.log("Post page: ");
    console.log("userId:" + userId);
    console.log("post_id: " + post_id);

    // GET POST ID FROM NAVIGATE. WHATEVER

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + userId + "/post/" + post_id,
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
          post: responseJson,
        }),
          console.log(this.state.post);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
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
        <View>
          <Text>
            From {this.state.post.author.first_name}{" "}
            {this.state.post.author.last_name}
          </Text>
          <Text> {this.state.post.text}</Text>
          <Button
            title="Like(not sure if it works"
            onPress={() =>
              this.likePost(
                this.state.post.post_id,
                this.state.post.author.user_id
              )
            }
          />

          <Button
            title="Delete post(to complete)"
            onPress={() =>
              this.deletePost(
                this.state.post.post_id,
                this.state.post.author.user_id
              )
            }
          />
          <Button title="Remove like(NOT CODED)" />
          <Button title="Update(NOT CODED)" />
        </View>
      );
    }
  }
}

export default PostScreen;
