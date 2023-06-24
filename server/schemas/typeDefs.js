
const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book!]!
    }

    type Book {
        bookID: String!
        authors: [String!]!
        description: String!
        title: String!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User!
    }

`;
