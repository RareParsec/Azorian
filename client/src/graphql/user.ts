export const HANDLE_EMAIL_CONFLICT = `
                 mutation($email:String!) {
                  handleEmailConflict(email: $email) {
                    success,
                    message
                  }
              }`;

export const CREATE_USER = `
                 mutation($email:String!, $username:String!) {
                  createUser(email: $email, username: $username) {
                  email
                  }
              }`;
