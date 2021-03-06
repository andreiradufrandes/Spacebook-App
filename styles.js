import styled from 'styled-components/native';

// Get fonts
// 2. Set sizes

// Font color for button
// #212121 on #dce4ef

export const Center = styled.View`
  flex-direction: row;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: 30px;
  color: black;
  text-align: center;
  font-family: Roboto-Black;
  font-weight: bold;
  margin-bottom: 15px;
  margin-top: 15px;
  background: #c1bdfd;
  padding: 10px;
`;

/*


              BUTTONS


*/

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: #5d3754;
  margin-bottom: 10px;
  text-align: center;
  max-width: 160px;
  // background-color: #5d3754;
  background-color: #3831a0;
  padding: 15px 15px;
`;

// Change the color according to accesibility
export const ButtonText = styled.Text`
  color: #ffffff;

  font-size: 14px;
  font-family: Roboto-Medium;
  letter-spacing: 1.25;
  // background-color: #5d3754;
`;

/*


              INPUT


*/

export const Input = styled.TextInput`
  backgroundcolor: '#ffffff';
  height: 50px;
  padding: 8px;
  margin-bottom: 20px;
  border-width: 2px;
  border-color: black;
  font-size: 16px;
  letter-spacing: 0.15;
  font-style: Roboto-Regular;
  width: 100%;
`;
export const Label = styled.Text`
  font-size: 16px;
  color: black;
  font-family: Roboto-Medium;
  letter-spacing: 1.25;
`;
export const PostInput = styled.TextInput`
  backgroundcolor: '#ffffff';
  height: 150px;
  padding: 8px;
  margin-bottom: 20px;
  border-width: 2px;
  border-color: black;
  font-size: 16px;
  letter-spacing: 0.15;
  font-style: Roboto-Regular;
  width: 100%;
`;

/*

        container


*/
export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #ffffff;
  padding: 5px;
  min-height: 100vh;
  background-color: #483fcd;
  padding-bottom: 50px;
  align-items: center;
`;

export const ContainerCentred = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #ffffff;
  padding: 5px;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #483fcd;
  padding-bottom: 50px;
`;

export const ScrollViewContainer = styled.ScrollView`
  flex: 1;
  max-width: 500px;
  min-width: 95%;
`;

/*

        BoxContainer


*/
export const BoxContainer = styled.View`
  width: 85%;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  max-width: 500px;
  background-color: #ffffff;
  // background-color: #c1bdfd;
  // flex: 1;
  align-items: center;
`;

/*

        Header & body


*/
export const Header = styled.View`
  background-color: #ffffff;
  // flex: 1;
  // justify-content: center;
  // align-items: center;
  padding: 10px;
  width: 100%;
  max-width: 500px;
  flex-grow: 1;
  flex-shrink: 1;
  margin-bottom: 10px;
`;
export const Body = styled.View`
  // flex: 3;

  width: 100%;
  max-width: 500px;
`;

/*

        Friend box for notification, friendlist, etc


*/

// 2 items per row
// space between
// maybe width

export const FriendBox = styled.View`
  // flex-direction: row;
  justify-content: space-between;
  // align-items: center;
  background-color: #ffffff;
  margin-bottom: 5px;
  padding: 10px;
  // flex-wrap: wrap;
  column-gap: 20px;
`;

/*

        Text


*/
export const BodyText = styled.Text`
  margin-bottom: 10px;
  font-size: 16px;
  font-family: Roboto-Medium;
`;

// export const Name = styled.Text`
//   margin-bottom: 10px;
//   font-size: 20px;
//   font-family: Roboto-Medium;
//   font-weight: bold
//   letter-spacing: 2px;

// `;
export const Name = styled.Text`
  font-size: 30px;
  color: black;
  text-align: center;
  font-family: Roboto-Black;
  font-weight: bold;
  margin-bottom: 15px;
  margin-top: 15px;
  background: #02d0fd;
  padding: 10px;
`;

export const PostText = styled.Text`
  margin-bottom: 10px;
  font-size: 20px;
  font-family: Roboto-Medium;
  font-style: italic;
  background-color: #dfdefe;
  text-align: center;
  padding: 10px;
`;

/*

        Profile image


*/
export const ProfileImage = styled.Image`
  width: 140;
  height: 140;
  // border-radius: 20px;
  border-radius: 50%;
  margin-bottom: 10px;
  align-self: center;
`;
/*

        Post


*/
export const NewPostBox = styled.View`
  // align-items: center;
  background-color: #ffffff;
  margin-bottom: 5px;
  padding: 10px;
`;

export const PostContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  max-width: 500px;
  background-color: #ffffff;
  margin-bottom: 5px;
`;

/*

        Loading container


*/
export const LoadingContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

/*

        Modal container



*/
export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margintop: 10;
`;

export const ModalView = styled.View`
  margin: 20px;
  background-color: white;
  padding: 40px;
  align-items: center;
  border: 2px;
`;
