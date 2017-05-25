/**
* @Author: eason
* @Date:   2017-05-25T20:31:10+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-25T21:37:39+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

const createHandlers = require('./lib');

const originHandlers = createHandlers();

const evaHandlers = {};

for (const handler in originHandlers) {
  evaHandlers[handler] = function (models, { req, res }) {
    // console.log(originHandlers[handler].toString());
    originHandlers[handler].call(this, req, res);
  };
}

module.exports = evaHandlers;
