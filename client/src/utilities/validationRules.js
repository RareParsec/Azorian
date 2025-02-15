export const emailValidationRules = [
  { rule: (email) => email.length > 0, message: "Email is required" },
  { rule: (email) => email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), message: "Email is invalid" },
];

export const passwordValidationRules = [
  { rule: (password) => password.length > 0, message: "Password is required" },
  { rule: (password) => password.length >= 6, message: "Password must be at least 6 characters long" },
  { rule: (password) => password.length <= 25, message: "Password must be at most 25 characters long" },
  { rule: (password) => password.match(/[A-Z]/), message: "Password must contain at least one uppercase letter" },
  { rule: (password) => password.match(/[a-z]/), message: "Password must contain at least one lowercase letter" },
  { rule: (password) => password.match(/[0-9]/), message: "Password must contain at least one number" },
];

export const usernameValidationRules = [
  { rule: (username) => username.length > 0, message: "Username is required" },
  { rule: (username) => username.length >= 3, message: "Username must be at least 3 characters long" },
  { rule: (username) => username.length <= 20, message: "Username must be at most 20 characters long" },
  {
    rule: (username) => username.match(/^[a-zA-Z0-9_]*$/),
    message: "Username can only contain letters, numbers, and underscores",
  },
];
