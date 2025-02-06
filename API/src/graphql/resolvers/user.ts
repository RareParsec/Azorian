const user = {
  Query: {
    users: async () => {
      console.log('HERE')
      return [{ id: 1, username: "John Doe", email: "kdoekdoe@gmail.com" }]
    },
  },

  Mutation: {
    createUser: async () => {
      console.log('HERE')
    }
  }
};

export default user;
