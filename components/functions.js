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
