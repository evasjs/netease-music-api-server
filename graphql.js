const { GraphQLScalarType } = require('graphql');
// const { makeExecutableSchema } from 'grapql-tools';
const fetch = require('node-fetch');
const api = require('./lib')();

const prefix = `http://127.0.0.1:${process.env.PORT || 5000}/v1`;

module.exports = {
  schemas: `
    scalar JSON

    # @TODO
    type Music {
      url: JSON
      detail: JSON
    }
    #type Music {
    #  url(
    #    # music id
    #    id: Int!,

        # music br
    #    br: Int = 128000
    #  ): JSON

    #  detail(
        # music id
    #    id: Int!
    #  ): JSON
    # }

    type Query {
      # Proxy restful api
      common(path: String!): JSON
      
      music(id: Int!, br: Int = 128000): Music
      # music: Music

    }
    
  `,
  resolvers: {
    /*
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
    */
    /*
    music: async ({ id, br }, ...others) => {
      return {
        url: await fetch(`${prefix}/music/url?id=${id}&br=${br}`).then(res => res.json()),
        detail: await fetch(`${prefix}/music/detail?id=${id}`).then(res => res.json()),
      };
    },
    */
    /*
    music: {
      async url({ id, br }) {
        const res = await fetch(`${prefix}/music/url?id=${id}&br=${br}`)
        return res.json();
      },
      async detail({ id }) {
        const res = await fetch(`${prefix}/music/detail?id=${id}`)
        return res.json();
      },
    },
    */
    //music(args) {
    //  return Object.assign({}, args);
    //},
  },
  types: {
    Query: {
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
      music: (_, args) => {
        return args;
      },
    },
    Music: {
      async url({ id, br }) {
        const res = await fetch(`${prefix}/music/url?id=${id}&br=${br}`)
        return res.json();
      },
      async detail({ id }) {
        const res = await fetch(`${prefix}/music/detail?id=${id}`)
        return res.json();
      },
    },
    JSON: new GraphQLScalarType({
      name: 'JSON',
      description: 'Extend JSON Type',
      serialize: val => val,
      // parseValue: val => val,
      // parseLiteral: (ast) => {},
    }), 
  },
};
