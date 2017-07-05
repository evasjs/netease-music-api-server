const { GraphQLScalarType } = require('graphql');
// const { makeExecutableSchema } from 'grapql-tools';
const fetch = require('node-fetch');
const api = require('./lib')();

module.exports = {
  schemas: `
    scalar JSON

    type Query {
      common(path: String!): JSON
    }
  `,
  resolvers: {
    async common({ path }) {
      if (!(path.split('?')[0] in api)) {
        return {
          code: -1,
          msg: 'invalid services',
        };
      }

      const res = await fetch(`http://127.0.0.1:${process.env.PORT || 5000}/v1${path}`);
      const json = await res.json();
      return json;
    },
  },
  types: {
    JSON: new GraphQLScalarType({
      name: 'JSON',
      description: 'Extend JSON Type',
      serialize: val => val,
      // parseValue: val => val,
      // parseLiteral: (ast) => {},
    }), 
  },
};
