const { GraphQLScalarType } = require('graphql');
// const { makeExecutableSchema } from 'grapql-tools';
const fetch = require('node-fetch');
const api = require('./lib')();

const prefix = `http://127.0.0.1:${process.env.PORT || 5000}/v1`;

function getJSON(path) {
  return fetch(`${prefix}${path}`).then(res => res.json());
}

module.exports = {
  schemas: `
    scalar JSON

    # 3.1 Music Type
    type Music {
      url: JSON
      detail: JSON
      lyric: JSON
    }

    # 3.2 Playlist Type
    type Playlist {
      catlist: JSON
      hot: JSON
    }

    # 3.3 Search Type
    type Search {
      single: JSON
      multi: JSON
      suggest: JSON
    }

    # 3.4 Top Type
    type Top {
      artist: JSON
      songs: JSON
      album: JSON
      mv: JSON
      playlist: JSON
    }

    # 3.5 Artist Type
    type Artist {
      person: JSON
      description: JSON
      album: JSON
      mv: JSON
      simi: JSON
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
      # 1 Proxy restful api
      common(path: String!): JSON
      
      # music: Music
      # 2.1 Music (url, detail)
      music(id: Int!, br: Int = 128000): Music

      # 2.2 Banner
      banner: JSON

      # 2.3 Playlist
      playlist: Playlist

      # 2.4 Search
      search(k: String!): Search

      # 2.5 Top
      top(offset: Int = 0, limit: Int = 10): Top

      # 2.6 Artist
      artist(id: Int!, offset: Int = 0, limit: Int = 10): Artist
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
      banner: async () => getJSON('/banner'),
      playlist: (_, args) => args,
      search: (_, args) => args,
      top: (_, args) => args,
      artist: (_, args) => args,
      // (_, { k }) => getJSON(`/search?keywords=${k}`),
    },
    Music: {
      async url({ id, br }) {
        return getJSON(`/music/url?id=${id}&br=${br}`)
      },
      async detail({ id }) {
        return getJSON(`/music/detail?id=${id}`)
      },
      lyric: async ({ id }) => getJSON(`/lyric?id=${id}`),
    },
    Playlist: {
      catlist: async () => getJSON(`/playlist/catlist`),
      hot: async () => getJSON('/playlist/hot'),
    },
    Search: {
      single: async ({ k }) => getJSON(`/search?keywords=${encodeURIComponent(k)}`),
      multi: async ({ k }) => getJSON(`/search/multimatch?keywords=${encodeURIComponent(k)}`),
      suggest: async ({ k }) => getJSON(`/search/suggest?keywords=${encodeURIComponent(k)}`),
    },
    Top: {
      artist: async ({ offset, limit }) => getJSON(`/top/artist?offset=${offset}&limit=${limit}`),
      songs: async ({ offset, limit }) => getJSON(`/top/songs?offset=${offset}&limit=${limit}`),
      album: async ({ offset, limit, type }) => getJSON(`/top/album?offset=${offset}&limit=${limit}&type=${type}`),
      mv: async ({ offset, limit, type }) => getJSON(`/top/mv?offset=${offset}&limit=${limit}&${type}`),
      playlist: async ({ offset, limit }) => getJSON(`/top/playlist?offset=${offset}&limit=${limit}`),
    },
    Artist: {
      person: async ({ id }) => getJSON(`/artist?id=${id}`),
      description: async ({ id }) => getJSON(`/artist/desc?id=${id}`),
      album: async ({ id, offset, limit }) => getJSON(`/artist/album?id=${id}&offset=${offset}&limit=${limit}`),
      mv: async ({ id, offset, limit }) => getJSON(`/artist/mv?id=${id}&offset=${offset}&limit=${limit}`),
      simi: async ({ id, offset, limit }) => getJSON(`/artist/simi?id=${id}`),
    },

    // Type
    JSON: new GraphQLScalarType({
      name: 'JSON',
      description: 'Extend JSON Type',
      serialize: val => val,
      // parseValue: val => val,
      // parseLiteral: (ast) => {},
    }), 
  },
};
