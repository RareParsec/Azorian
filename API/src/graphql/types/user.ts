const user = `#graphql
    type User {
        username: String!
        email: String!
    }

    type Query {
    users: [User!]
    }

    type Mutation {
        createUser(username: String!, email: String!): User!
        handleEmailConflict(email: String!): Response!
    }
`;

export default user;
