import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { dateScalar } from './scalars.js';

// Data
import movies from './data/movies.json' assert { type: 'json' };
import countries from './data/countries.json' assert { type: 'json' };
import directors from './data/directors.json' assert { type: 'json' };

const typeDefs = `#graphql
    scalar Date
    type Movie {
        id: ID!
        country_code: String
        country: Country
        title: String!
        year: Int!
        cast: [String]!
        genres: [String]!
        deprecated: Int @deprecated(reason: "deprecated lorem ipsum")
    }
    type Country {
        country_code: String!
        name: String!
    }
    type Director {
        id: ID!
        DOB: Date!
    }
    type Query {
        movies (year: Int, country_code: String): [Movie]!
        directors (DOB: Date): [Director]!
    }
`;

const resolvers = {
    Movie: {
        country(parent, args, contextValue, info) {
            return countries
                .find(c => c.country_code === parent.country_code);
        },
    },
    Query: {
        movies(parent, args, contextValue, info) {
            return movies
                .filter(m => m.year === args.year && m.country_code == args.country_code);
        },
        directors(parent, args, contextValue, info) {
            return directors
                // server:
                .map(d => {
                    d.DOB = new Date(d.DOB);
                    return d;
                })
                // response:
                .filter(d => !args.DOB || d.DOB.getTime() == args.DOB.getTime());
        },
    },
    Date: dateScalar,
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
