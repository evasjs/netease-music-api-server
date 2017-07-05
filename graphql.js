const { GraphQLScalarType } = require('graphql');
// const { makeExecutableSchema } from 'grapql-tools';
const fetch = require('node-fetch');
const api = require('./lib')();

const prefix = `http://127.0.0.1:${process.env.PORT || 5000}/v1`;

module.exports = {
  schemas: `
    scalar JSON

    type Query {
      common(path: String!): JSON
    
      music(id: Int!, type: String = "url", br: Int = 128000): JSON
    }
  `,
  resolvers: {
    async common({ path }) {
      if (!(path.split('?')[0] in api)) {
        return {
          code: 0X0001,
          msg: 'invalid services',
        };
      }

      const res = await fetch(`${prefix}${path}`);
      const json = await res.json();
      return json;
    },
    async music({ id, type, br }) {
      if (!['url', 'detail'].includes(type)) {
        return {
          code: 0X0002,
          msg: 'invalid type',
        };
      }
      const res = await fetch(`${prefix}/music/${type}?id=${id}&br=${br}`)
      return res.json();
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
