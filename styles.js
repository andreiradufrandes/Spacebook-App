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
`;

/*


              BUTTONS


*/

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: #5d3754;
  // flex: 1;
  margin-bottom: 10px;
  text-align: center;
  max-width: 160px;
`;

// Change the color according to accesibility
export const ButtonText = styled.Text`
  color: #ffffff;
  padding: 15px 15px;
  font-size: 14px;
  font-family: Roboto-Medium;
  letter-spacing: 1.25;
  background-color: #5d3754;
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
  font-style: Roboto-Regular !important;
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
  justify-content: center;
  flex-direction: column;
  align-items: center;
  align-content: space-between;

  min-height: 100vh;
  background-color: #520f9a;
`;

/*

        signuploginbox


*/
export const BoxContainer = styled.View`
  width: 80%;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  max-width: 500px;
  background-color: #ffffff;
`;
