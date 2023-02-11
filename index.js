import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import movies from './data/movies.json' assert { type: 'json' };

const typeDefs = `#graphql
    type Movie {
        id: ID!
        country_code: String
        title: String!
        year: Int!
        cast: [String]!
        genres: [String]!
    }   
    type Query {
        movies: [Movie]!
    }
`;

const resolvers = {
    Query: {
        movies: () => movies,
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 3006 },
});

console.log(`🚀 Server ready at: ${url}`);
