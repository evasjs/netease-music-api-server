/**
* @Author: eason
* @Date:   2017-04-12T07:45:29+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-25T21:49:00+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

const Eva = require('eva-server');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');

const handlers = require('./handlers');
const routes = require('./routes');
const { schemas, resolvers, types } = require('./graphql');

const app = Eva({
  server: {
    HOST: '0.0.0.0',
    PORT: process.env.PORT || 5000
  },
  db: null,
});

app.register({
  namespace: 'netease-music',
  routes,
  handlers,
});

app._instance.use('/graphql', graphqlHTTP({
  // schema: buildSchema(schemas),
  schema: makeExecutableSchema({ typeDefs: schemas, resolvers: types }),
  rootValue: resolvers,
  graphiql: true,
}));

app.start();

// app.instance.set('port', process.env.PORT || 5000);
//
// app.instance.listen(app.instance.get('port'), () => {
//   console.log('Node app is running on port', app.instance.get('port'));
// });
