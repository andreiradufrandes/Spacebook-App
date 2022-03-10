export function checkName(name) {
  if (name == '') {
    return false;
  } else if (!/[^a-zA-Z]/.test(name)) {
    return true;
  } else {
    return false;
  }
}

// Function to check password
// 1. Minimum amount of letter
// 2. At least 1 number
// 3. At least 1 uppercase letter
// 4, Between 10 to 16 charates

// Function to check post

export function checkPassword(password) {
  return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]){10,16}$/.test(password);
  // at least one number
}
// Andreifran2!
