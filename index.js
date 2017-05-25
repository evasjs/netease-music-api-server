/**
* @Author: eason
* @Date:   2017-04-12T07:45:29+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-25T21:46:41+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

const Eva = require('eva-server');

const handlers = require('./handlers');
const routes = require('./routes');

const app = Eva({
  server: {
    HOST: 'localhost',
    PORT: process.env.PORT || 5000
  },
  db: null,
});

app.register({
  namespace: 'netease-music',
  routes,
  handlers,
});

app.start();

// app.instance.set('port', process.env.PORT || 5000);
//
// app.instance.listen(app.instance.get('port'), () => {
//   console.log('Node app is running on port', app.instance.get('port'));
// });
