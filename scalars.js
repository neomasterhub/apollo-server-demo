import { GraphQLScalarType, Kind } from 'graphql';

export const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',

    // Serializes data from server.
    serialize(value) {
        if (value instanceof Date) {
            return value.toLocaleDateString();
        }
        throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },

    // Parses $arg.
    parseValue(value) {
        const date = new Date(value);
        if (date == 'Invalid Date') {
            throw new Error('GraphQL Date Scalar parser expected valid date string view');
        }
        return new Date(value);
    },

    // Parses literal in the query
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});
