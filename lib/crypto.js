const crypto = require('crypto');
const bigInt = require('big-integer');
const modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
const nonce = '0CoJUm6Qyw8W8jud';
const pubKey = '010001';

String.prototype.hex = function () {
  return this.split('').map((e) => {
    const hex = e.charCodeAt(0).toString(16);
   return ('' + hex).slice(-4); 
  }).join('');
};

function createSecretKey(size) {
  const keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return '*'.repeat(size)
      .split('')
      .map(() => keys[Math.floor(Math.random() * keys.length)])
      .join('');
}

function aesEncrypt(text, secKey) {
  const intialVector = new Buffer('0102030405060708', 'binary');
  const key = new Buffer(secKey, 'binary');
  const cipher = crypto.createCipheriv('AES-128-CBC', key, intialVector);
  const encrypted = cipher.update(text, 'utf8', 'base64');
  return encrypted + cipher.final('base64');
}

function rsaEncrypt(text, pubKey, modulus) {
  const rText = text.split('').reverse().join('');
  const biText = bigInt(new Buffer(rText).toString('hex'), 16);
  const biEx = bigInt(pubKey, 16);
  const biMod = bigInt(modulus, 16);
  const biRet = biText.modPow(biEx, biMod);
  
  const encrypted = biRet.toString(16);

  return encrypted.length < 256 ? '0'.repeat(256 - encrypted.length) + encrypted : encrypted;
}

module.exports = function Encrypt(obj) {
  const json = JSON.stringify(obj);
  const secKey = createSecretKey(16);
  const encText = aesEncrypt(aesEncrypt(json, nonce), secKey);
  const encSecKey = rsaEncrypt(secKey, pubKey, modulus);
  return {
    params: encText,
    encSecKey,
  };
};
