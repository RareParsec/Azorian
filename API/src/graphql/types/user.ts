const user = `#graphql
    type User {
        id: ID!
        username: String!
        email: String!
    }

    type Query {
        users: [User!]
    }

    type Mutation {
        createUser(username: String!, email: String!): User!
    }
`;

export default user;
