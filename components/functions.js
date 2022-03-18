// Check the name is not empty and that it only contains letters
export function checkName(name) {
  if (name == '') {
    return false;
  } else if (!/[^a-zA-Z]/.test(name)) {
    return true;
  } else {
    return false;
  }
}

// That that an input only contains letters and spaces
export function checkLettersAndSpaces(input) {
  if (!/[^a-zA-Z\s]/.test(input)) {
    return true;
  } else {
    return false;
  }
}

// Check that an inut input only contains letters, spaces, and number
export function checkLettersSpacesNumbers(input) {
  if (!/[^0-9a-zA-Z\s]/.test(input)) {
    return true;
  } else {
    return false;
  }
}

// Function to turn a time stamp into time and date strings
export function timeAndDateExtractor(timestamp) {
  let date = timestamp.slice(0, 10);
  let time = timestamp.slice(11, 16);
  return [date, time];
}
