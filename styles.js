import styled from 'styled-components/native';

// Get fonts
// 2. Set sizes

// Font color for button
// #212121 on #dce4ef

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #ffffff;
  padding: 5px;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: #dce4ef;
`;

export const Center = styled.View`
  flex-direction: row;
  justify-content: center;
`;

// Change the color according to accesibility
export const ButtonText = styled.Text`
  font-style: Tahoma;
  color: 212121;
  text-allign: center;
  padding: 15px 25px;
  font-size: 15px;
  font-family: Roboto-Black;
`;

// Add font
// change color for accessibilty
export const Title = styled.Text`
  font-size: 30px;
  color: black;
  text-align: center;
  font-family: Roboto-Black;
  font-weight: bold;
`;

// Not sure if 16 sp works
// add font weight (maybe)
export const Label = styled.Text`
  font-size: 1.3rem;
  color: black;
  font-family: Roboto-Black;
  font-weight: bold;
`;

export const TextBox = styled.TextInput`
  padding: 12px;
  margin: 15px;
  width: 70%;
  background-color: #edf7ff;
  borderradius: 10;
  height: 50;
  font-family: Roboto-Black;
`;
