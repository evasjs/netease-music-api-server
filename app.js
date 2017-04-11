const app = require('./lib')();

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
