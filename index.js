/**
* @Author: eason
* @Date:   2017-04-12T07:45:29+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-25T20:35:19+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

const Eva = require('eva-server');

const handlers = require('./handlers');
const routes = require('./routes');

const app = Eva({
  server: {
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

// app.set('port', process.env.PORT || 5000);
//
// app.listen(app.get('port'), () => {
//   console.log('Node app is running on port', app.get('port'));
// });
