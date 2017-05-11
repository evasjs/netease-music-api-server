/**
* @Author: eason
* @Date:   2017-04-12T07:46:33+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-11T20:54:41+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

const crypto = require('crypto');
const http = require('http');
const Encrypt = require('./crypto');

// 1 String 2 Hex
String.prototype.hex = function () {
  // return this.split('').map((e) => {
  //  const hex = e.charCodeAt(0).toString(16);
  // return ('' + hex).slice(-4);
  // }).join('');
  return new Buffer(this).toString('hex');
};

String.prototype.charCodeArray = function () {
  return this.split('').map(e => e.charCodeAt(0));
};

Array.prototype.charCodeString = function () {
  return this.map(e => String.fromCharCode(e)).join('');
};

function id2Url(pic_str) {
  const magic = '3go8&$8*3*3h0k(2)2'.charCodeArray();
  const songId = pic_str
                .charCodeArray()
                .map((e, i) => e ^ magic[i % magic.length]);
  const md5 = crypto.createHash('md5').update(songId.charCodeString());
  return md5.digest('base64').replace(/\//g, '_').replace(/\+/, '-');
}

function createRequest(path, method, data, callback) {
  let ne_req = '';
  const client = http.request({
    hostname: 'music.163.com',
    method,
    path,
    headers: {
      Referer: 'http://music.163.com',
      Cookie: 'appver=1.5.6',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }, (res) => {
    res.setEncoding('utf8');
    res.on('data', chunk => (ne_req += chunk));
    res.on('end', () => callback(ne_req));
  });

  if (method === 'POST') {
    client.write(data);
  }

  client.end();
}


function createWebAPIRequest(path, data, cookie, eres, method = 'POST') {
  let music_req = '';
  const cryptoReq = Encrypt(data);
  console.log(data, cryptoReq);
  const client = http.request({
    hostname: 'music.163.com',
    method,
    path,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'http://music.163.com',
      'Host': 'music.163.com',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
      'X-Real-IP': '58.41.124.122',
    },
  }, (res) => {
    res.on('error', err => {
      eres.status(502).send('fetch error');
    });

    res.setEncoding('utf8');
    if (res.statusCode !== 200) {
      return createWebAPIRequest(path, data, cookie, eres, method);
    } else {
      res.on('data', chunk => (music_req += chunk));
      res.on('end', () => {
        if (music_req === '') {
          return createWebAPIRequest(path, data, cookie, eres, method);
        }
        if (res.headers['set-cookie']) {
          eres.set({
            'Set-Cookie': res.headers['set-cookie'],
          });
          return eres.send({
            c: res.headers['set-cookie'],
            i: JSON.parse(music-req),
          });
        }

        eres.send(music_req);
      });
    }
  });

  client.write(`params=${cryptoReq.params}&encSecKey=${cryptoReq.encSecKey}`);
  client.end();
}

module.exports = {
  id2Url,
  createRequest,
  createWebAPIRequest,
};
