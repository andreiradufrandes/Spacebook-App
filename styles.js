import styled from 'styled-components/native';

// Get fonts
// 2. Set sizes

// Font color for button
// #212121 on #dce4ef

export const Center = styled.View`
  flex-direction: row;
  justify-content: center;
`;

// Add font
// change color for accessibilty

// Not sure if 16 sp works
// add font weight (maybe)
// not sure

export const TextBox = styled.TextInput`
  // padding: 12px;
  // margin: 15px;
  // width: 70%;
  // background-color: #edf7ff;
  // borderradius: 10;
  // height: 50;
  // font-family: Roboto-Black;
`;

export const Title = styled.Text`
  font-size: 30px;
  color: black;
  text-align: center;
  font-family: Roboto-Black;
  font-weight: bold;
  margin-bottom: 15px;
  margin-top: 15px;
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
`;

// Change the color according to accesibility
export const ButtonText = styled.Text`
  color: #ffffff;
  padding: 15px 15px;
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

/*

        container


*/
export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #ffffff;
  padding: 5px;
  // justify-content: center;
  // flex-direction: column;
  // align-items: center;
  // align-content: space-between;
  min-height: 100vh;
  background-color: #483fcd;
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
`;

export const ScrollViewContainer = styled.ScrollView`
  flex: 1;
`;

/*

        BoxContainer


*/
export const BoxContainer = styled.View`
  width: 80%;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  max-width: 500px;
  background-color: #ffffff;
  // background-color: #c1bdfd;
  // flex: 1;
`;

/*

        Header & body


*/
export const Header = styled.View`
  background-color: #ffffff;
  flex: 1;
  // justify-content: center;
  // align-items: center;
  padding: 10px;
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
`;
export const Body = styled.View`
  flex: 3;
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

export const BodyText = styled.Text`
  margin-bottom: 10px;
`;
