// export function checkName(name) {
//   if (name == '') {
//     return false;
//   } else if (!/[^a-zA-Z]{2,}/.test(name)) {
//     return true;
//   } else {
//     return false;
//   }
// }

export function checkName(name) {
  if (name == '') {
    return false;
  } else if (!/[^a-zA-Z]/.test(name)) {
    return true;
  } else {
    return false;
  }
}

// Function to check pasword
// 1. Minimum amount of letter
// 2. At least 1 number
// 3. At least 1 uppercase letter
// 4, Between 10 to 16 charates

// Function to check post

// export function checkPassword(password) {
//   return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]){10,16}$/.test(password);
//   // at least one number
// }
// Andreifran2!

// only letters and spaces
// /^[a-zA-Z\s]*$/;

export function checkLettersAndSpaces(input) {
  if (!/[^a-zA-Z\s]/.test(input)) {
    return true;
  } else {
    return false;
  }
}

export function checkLettersSpacesNumbers(input) {
  if (!/[^0-9a-zA-Z\s]/.test(input)) {
    return true;
  } else {
    return false;
  }
}

export function timeAndDateExtractor(timestamp) {
  let date = timestamp.slice(0, 10);
  let time = timestamp.slice(11, 16);
  return [date, time];
}

/*

Uppercase and lowercase letters (A-Z and a-z)
Numeric characters (0-9)
Special characters - ! # $ % & ' * + - / = ? ^ _ ` { | } ~
Period, dot, or full stop (.) with the condition that it cannot be the first or last letter of the email and cannot repeat one after another.




valid email
/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

*/

export function checkEmail(email) {
  if (/[^0-9a-zA-Z\s]/.test(email)) {
    return true;
  } else {
    return false;
  }
}
