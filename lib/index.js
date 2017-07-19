/**
* @Author: eason
* @Date:   2017-04-12T07:46:33+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-25T20:22:21+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

var express = require('express');
var http = require('http');
var crypto = require('crypto');
var { Cookie } = require('tough-cookie');
const cors = require('cors');
const { createRequest, createWebAPIRequest, id2Url } = require('./utils');

var dir = "/v1"

module.exports = function createApi(options = {}) {
  // const { whitelist = [] } = options;
  //
  // const corsOptions = function (req, cb) {
  //   const corsOption = { origin: false };
  //   if (whitelist.indexOf('*') !== -1 || whitelist.indexOf(req.header('Origin')) !== -1) {
  //     corsOption.origin = true;
  //   }
  //   cb(null, corsOptions);
  // };
  //
  // var app = express();
  //
  // app.use(cors(corsOptions));

  return {
    '/hi': function (req, res) {
      res.status(200).send('hi');
    },
    '/login/cellphone': function(request, response) {
      var phone = request.query.phone;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var md5sum = crypto.createHash('md5');
      md5sum.update(request.query.password);
      var data = {
        'phone': phone,
        'password': md5sum.digest('hex'),
        'rememberLogin': 'true'
      };
      createWebAPIRequest('/weapi/login/cellphone', data, cookie, response)
    },
    '/login': function(request, response) {
      var email = request.query.email;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var md5sum = crypto.createHash('md5');
      md5sum.update(request.query.password);
      var data = {
        'username': email,
        'password': md5sum.digest('hex'),
        'rememberLogin': 'true'
      };
      createWebAPIRequest('/weapi/login', data, cookie, response)
    },
    //登录信息刷新
    '/login/refresh': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var csrf = ""
      for(i in cookie) {
        if(cookie[i].name == '__csrf') {
          csrf = cookie.value
        }
      }
      csrf=request.query.t
      var data = {
        "csrf_token":csrf
      };
      createWebAPIRequest('/weapi/login/token/refresh?csrf_token=' + csrf, data, cookie, response)
    },
    '/banner': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": ""
      }
      createWebAPIRequest('/api/v2/banner/get', data, cookie, response, 'GET')
      //createRequest('/api/v2/banner/get', 'GET', data, function(res) {
      //  response.setHeader("Content-Type", "application/json");
      //  response.send(res);
      //});
    },
    //歌单类型列表
    '/playlist/catlist': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/playlist/catalogue', data, cookie, response)
    },
    //歌单类型列表-热门类型
    '/playlist/hot': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {};
      createWebAPIRequest('/api/playlist/hottags', data, cookie, response)
    },
    //推荐新音乐
    '/personalized/newsong': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        type: "recommend"
      };
      createWebAPIRequest('/api/personalized/newsong', data, cookie, response)
    },
    //推荐歌单
    '/personalized': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {};
      createWebAPIRequest('/api/personalized/playlist', data, cookie, response)
    },
    //推荐mv
    '/personalized/mv': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {};
      createWebAPIRequest('/api/personalized/mv', data, cookie, response)
    },
    //独家放送
    '/personalized/privatecontent': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {};
      createWebAPIRequest('/api/personalized/privatecontent', data, cookie, response)
    },
    //推荐dj
    '/personalized/djprogram': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {};
      createWebAPIRequest('/api/personalized/djprogram', data, cookie, response)
    },

    //每日推荐歌曲
    '/recommend/songs': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "offset": 0,
        "total": true,
        "limit": 20,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/v1/discovery/recommend/songs', data, cookie, response)
    },
    //取消推荐
    '/recommend/dislike': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        resId: request.query.id,
        resType: request.query.type,
        alg: request.query.alg, //'itembased2',
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/discovery/recommend/dislike', data, cookie, response)
    },

    //  每日推荐歌单
    '/recommend/resource': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'offset': 0,
        'limit': 20,
        'total': 'True',
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/v1/discovery/recommend/resource', data, cookie, response)
    },
    //收藏单曲到歌单，从歌单删除歌曲 op=del,add;pid=歌单id,tracks=歌曲id
    '/playlist/tracks': function(request, response) {
      var op = request.query.op
      var pid = request.query.pid;
      var tracks = request.query.tracks;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "op": op,
        "pid": pid,
        "tracks": tracks,
        "trackIds": JSON.stringify([tracks]),
        "csrf_token": "",
      };
      createWebAPIRequest('/weapi/playlist/manipulate/tracks', data, cookie, response)
    },
    //搜索
    '/search': function(request, response) {
      var keywords = request.query.keywords || '';
      var type = request.query.type || 1;
      var offset = request.query.offset || '0';
      var limit = request.query.limit || 20;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "s": keywords,
        "offset": offset,
        "limit": limit,
        "type": type
      };
      createWebAPIRequest('/weapi/cloudsearch/get/web', data, cookie, response)
    },
    //搜索 multimatch
    '/search/multimatch': function(request, response) {
      var keywords = request.query.keywords || '';
      var type = request.query.type || 1;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": "",
        type: type || 1,
        s: keywords || ''
      };
      createWebAPIRequest('/weapi/search/suggest/multimatch', data, cookie, response)
    },
    //搜索 hot
    '/search/hot': function(request, response) {
      var keywords = request.query.keywords || '';
      var type = request.query.type || 1;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        type: 1
      };
      createWebAPIRequest('/api/search/hot?type=1', data, cookie, response)
    },
    //搜索 suggest
    '/search/suggest': function(request, response) {
      var keywords = request.query.keywords || '';
      var type = request.query.type || 1;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": "",
        type: type || 1,
        s: keywords || ''
      };
      createWebAPIRequest('/weapi/search/suggest/web', data, cookie, response)
    },
    //fm,
    '/fm': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/v1/radio/get', data, cookie, response)
    },

    //歌词
    '/lyric': function(request, response) {
      var id = request.query.id;
      createRequest('/api/song/lyric?os=osx&id=' + id + '&lv=-1&kv=-1&tv=-1', 'GET', null, function(res) {
        response.setHeader("Content-Type", "application/json");
        response.send(res);
      });
    },

    //热门歌手
    '/top/artist': function(request, response) {
      var data = {
        'offset': request.query.offset || 0,
        'total': false,
        'limit': request.query.limit || 10,
      }
      createRequest('/api/artist/top?total=false&limit=' + request.query.limit + '&offset=' + request.query.offset, 'GET', null, function(res) {
        response.setHeader("Content-Type", "application/json");
        response.send(res);
      });
    },
    //新歌上架 ,type ALL, ZH,EA,KR,JP
    '/top/songs': function(request, response) {
      var data = {
        'offset': request.query.offset || 0,
        'total': true,
        'limit': request.query.limit || 10,
        'area': request.query.type || 'ZH',
        "csrf_token": ""
      }
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/v1/discovery/new/songs', data, cookie, response);
    },
    //新碟上架 ,type ALL, ZH,EA,KR,JP
    '/top/album': function(request, response) {
      var data = {
        'offset': request.query.offset || 0,
        'total': true,
        'limit': request.query.limit || 10,
        'area': request.query.type || 'ZH',
        "csrf_token": ""
      }
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/album/new', data, cookie, response);
    },
    //mv 排行,type ALL, ZH,EA,KR,JP
    '/top/mv': function(request, response) {
      var data = {
        'offset': request.query.offset || 0,
        'total': true,
        'limit': request.query.limit || 10,
        'area': request.query.type || 'ZH',
        'type': request.query.type || 'ZH',
        "csrf_token": ""
      }
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/mv/toplist', data, cookie, response);
    },
    //mv 最新mv,type ALL, ZH,EA,KR,JP
    '/top/mv/first': function(request, response) {
      var data = {
        'offset': request.query.offset,
        'total': true,
        'limit': request.query.limit,
        'area': request.query.type,
        "csrf_token": ""
      }
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/mv/first', data, cookie, response);
    },
    //分类歌单
    '/top/playlist': function(request, response) {
      var data = {
        'offset': request.query.offset,
        'order': request.query.order || 'hot',
        'limit': request.query.limit,
        'cat': request.query.type,
        "csrf_token": ""
      }
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/playlist/list', data, cookie, response);
    },
    //精品歌单
    '/top/playlist/highquality': function(request, response) {
      var data = {
        'cat': request.query.type,
        "csrf_token": ""
      }
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/playlist/highquality/list', data, cookie, response);
    },
    //simi ,相似歌单，歌曲，关注的用户
    '/simi/playlist': function(request, response) {
      var data = {
        'songid': request.query.id,
        "csrf_token": ""
      }
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/discovery/simiPlaylist', data, cookie, response);
    },
    '/simi/song': function(request, response) {
      var data = {
        'songid': request.query.id,
        "csrf_token": ""
      }
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/v1/discovery/simiSong', data, cookie, response);
    },
    '/simi/user': function(request, response) {
      var data = {
        'songid': request.query.id,
        "csrf_token": ""
      }
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/discovery/simiUser', data, cookie, response);
    },
    //评论
    '/comments': function(request, response) {
      var id = request.query.id;
      var limit = request.query.limit;
      var offset = request.query.offset;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var type = request.query.type == 'hot' ? 'hotcomments' : 'comments';
      var data = {
        "rid": id,
        "offset": offset,
        "limit": limit,
        "total": false,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/v1/resource/' + type + '/' + id, data, cookie, response)
    },

    //艺术家
    '/artist': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/v1/artist/' + id, data, cookie, response)
    },

    //艺术家-专辑
    '/artist/album': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "offset": request.query.offset || 0,
        "limit": request.query.limit || 10,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/artist/albums/' + id, data, cookie, response)
    },
    //艺术家-mv
    '/artist/mv': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        artistId: id,
        "total": true,
        "offset": request.query.offset || 0,
        "limit": request.query.limit || 10,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/artist/mvs', data, cookie, response)
    },
    //艺术家 信息
    '/artist/desc': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        id: id,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/artist/introduction', data, cookie, response)
    },
    //艺术家 ,相似歌手
    '/artist/simi': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        artistid: id,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/discovery/simiArtist', data, cookie, response)
    },
    //个人信息，歌单，收藏，mv,dj数量
    '/user/subcount': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        userId: id,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/subcount', data, cookie, response)
    },
    //云盘数据
    '/user/cloud': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        limit: request.query.limit,
        offset: request.query.offset,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/v1/cloud/get', data, request.query.cookie, response)
    },
    //云盘数据
    '/user/cloud/search': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        byids: request.query.id,
        id: request.query.id,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/v1/cloud/get/byids', data, cookie, response)
    },
    //mv detail
    '/mv': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        id: id,
        "csrf_token": ""
      };
      //createWebAPIRequest('/weapi/v1/mv/detail/', data, cookie, response)
      createWebAPIRequest('/api/mv/detail?id=' + id + '&type=mp4', data, cookie, response)
    },
    //simi mv
    '/mv/simi': function(request, response) {
      var id = parseInt(request.query.id);
      var br = parseInt(request.query.br || '128000');
      var data = {
        mvid: id,
        "csrf_token": ""
      };
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/discovery/simiMV', data, cookie, response)
    },
    //mv播放地址
    '/mv/url': function(request, response) {
      var id = parseInt(request.query.id);
      var br = parseInt(request.query.br || '128000');
      var data = {
        "ids": [id],
        id: id,
        "br": br,
        "csrf_token": ""
      };
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/song/enhance/play/mv/url', data, cookie, response)
    },
    //单曲详情
    '/music/detail': function(request, response) {
      var id = parseInt(request.query.id);
      var data = {
        "id": id,
        'c': JSON.stringify([{ id: id }]),
        "ids": '[' + id + ']',
        "csrf_token": ""
      };
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/v3/song/detail', data, cookie, response)
    },
    //专辑详情
    '/album/detail': function(request, response) {
      var id = parseInt(request.query.id);
      var data = {
        "csrf_token": ""
      };
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/v1/album/' + id, data, cookie, response)
    },
    //单曲播放地址
    '/music/url': function(request, response) {
      var id = parseInt(request.query.id);
      var br = parseInt(request.query.br || '128000');
      var data = {
        "ids": [id],
        "br": br,
        "csrf_token": ""
      };
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/weapi/song/enhance/player/url', data, cookie, response)
    },
    //用户详情
    '/user/detail': function(request, response) {
      var id = parseInt(request.query.uid);
      var data = {
        "csrf_token": ""
      };
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      createWebAPIRequest('/api/v1/user/detail/' + id, data, cookie, response, 'GET')
    },
    //用户歌单
    '/user/playlist': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "offset": request.query.offset || '0',
        "uid": request.query.uid,
        "limit": request.query.limit || 20,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/user/playlist', data, cookie, response)
    },
    //用户电台
    '/user/radio': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "userId": request.query.uid,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/djradio/get/byuser', data, cookie, response)
    },
    //用户关注列表
    '/user/follows': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        offset: request.query.offset || '0',
        limit: request.query.limit || 1000,
        order: true
      }
      createWebAPIRequest('/weapi/user/getfollows/' + request.query.id, data, cookie, response)
    },
    //关注,取消关注，用户
    '/follow': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": ""
      }
      var url = request.query.type == 'add' ? 'follow' : "delfollow"
      createWebAPIRequest('/weapi/user/' + url + '/' + request.query.id, data, cookie, response)
    },
    //用户粉丝列表
    '/user/followeds': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'userId': request.query.id,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/user/getfolloweds/', data, cookie, response)
    },
    //歌单详情
    '/playlist/detail': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "id": request.query.id,
        "offset": request.query.offset || '0',
        "total": false,
        "n": request.query.limit || 100,
        "limit": request.query.limit || 100,
        "csrf_token": ""
      };
      createWebAPIRequest('/weapi/v3/playlist/detail', data, cookie, response)

    },
    //歌单详情-旧，获取封面
    '/playlist/img': function(request, response) {
      createWebAPIRequest('/api/playlist/detail?id=' + request.query.id, null, null, response)
    },

    //签到
    '/daily_signin': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'type': request.query.type,
      }
      createWebAPIRequest('/weapi/point/dailyTask', data, cookie, response);
    },

    //听歌记录 uid,type 0所以，1 week，
    '/record': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'type': request.query.type,
        uid: request.query.uid,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/v1/play/record', data, cookie, response)
    },
    //红心歌曲
    '/likelist': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        uid: request.query.uid,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/song/like/get', data, cookie, response)
    },
    //program-like
    '/program/like': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'threadId': request.query.id,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/resource/like', data, cookie, response)
    },
    //电台类型列表
    '/djradio/catelist': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/djradio/category/get', data, cookie, response)
    },
    //推荐节目
    '/program/recommend': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        cateId: request.query.type,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/program/recommend/v1', data, cookie, response)
    },
    //精选电台
    '/djradio/recommend': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/djradio/recommend/v1', data, cookie, response)
    },
    //精选电台-分类电台
    '/djradio/recommend/type': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        cateId: request.query.type,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/djradio/recommend', data, cookie, response)
    },
    //分类电台
    '/djradio/hot': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'cat': request.query.type,
        cateId: request.query.type,
        type: request.query.type,
        categoryId: request.query.type,
        category: request.query.type,
        limit: request.query.limit,
        offset: request.query.offset,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/djradio/hot/v1', data, cookie, response)
    },
    //dj单期节目program-detail
    '/program/detail': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'id': request.query.id,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/dj/program/detail', data, cookie, response)
    },
    //dj主播 radio
    '/dj/program': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'asc': request.query.asc,
        'radioId': request.query.id,
        'limit': request.query.limit,
        'offset': request.query.offset,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/dj/program/byradio', data, cookie, response)
    },

    //djradio detail
    '/dj/detail': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'id': request.query.id,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/djradio/get', data, cookie, response)
    },

    //用户动态
    '/event/get': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'time': -1,
        'offset': request.query.offset || '0',
        'pagesize': request.query.limit || 20,
        'getcounts': true,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/event/get/' + request.query.id, data, cookie, response)
    },
    //dj 订阅
    '/dj/sub': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "id": id,
        "csrf_token": ""
      }
      createWebAPIRequest("/weapi/djradio/"+(request.query.t==1?'sub':'unsub'), data, cookie, response)
    },
    //program like act
    '/resource/like': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "threadId": id,
        "csrf_token": ""
      }
      createWebAPIRequest("/weapi/resource/"+(request.query.t==1?'like':'unlike'), data, cookie, response)
    },
    //comment like act
    '/comment/like': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "threadId": request.query.origin,
        commentId:id,
        "csrf_token": ""
      }
      createWebAPIRequest("/weapi/v1/comment/"+(request.query.t==1?'like':'unlike'), data, cookie, response)
    },
    //歌曲喜欢和删除 op=like or trash,songid,
    '/song/tracks': function(request, response) {
      var op = request.query.op
      var pid = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var url = op == 'like' ? '/weapi/radio/like' : '/weapi/radio/trash/add'
      var data = op == 'like' ? {
        "alg": request.query.r != 'del' ? 'itembased' : 'RT',
        "trackId": pid,
        "like": request.query.r != 'del' ? 'true' : 'false',
        "time": 2,
        "csrf_token": ""
      } : {
        "alg": 'RT',
        "songId": pid,
        "time": 2,
        "csrf_token": ""
      };
      createWebAPIRequest(url, data, cookie, response)
    },

    //用户电台
    '/user/dj': function(request, response) {
      var id = request.query.id;
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        'offset': request.query.offset || '0',
        'limit': request.query.limit || 20,
        "csrf_token": ""
      }
      createWebAPIRequest('/weapi/dj/program/' + id, data, cookie, response)
    },

    '/log/web': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "action": request.query.action,
        "json": request.query.json,
        "csrf_token": "",
      };
      createWebAPIRequest('/weapi/log/web', data, cookie, response)
    },
    '/id2url': function(req, res) {
      res.setHeader("Content-Type", "application/json");
      res.send(id2Url(req.query.id));
    },
    //toplist
    '/toplist': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": "",
      };
      createWebAPIRequest('/weapi/toplist', data, cookie, response)
    },
    //playlistall
    '/playlist/all': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        "csrf_token": "",
      };
      createWebAPIRequest('/weapi/playlist/category/list', data, cookie, response)
    },

    //排行榜详细
    '/toplist/detail': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        id: request.query.id || 3778678,
        limit: 20,
        "csrf_token": "",
      };
      createWebAPIRequest('/weapi/toplist/detail', data, cookie, response)
    },
    //艺术家分类
    '/toplist/artist': function(request, response) {
      var cookie = request.get('Cookie') ? request.get('Cookie') : (request.query.cookie ? request.query.cookie : '');
      var data = {
        type: request.query.type,
        "csrf_token": "",
      };
      createWebAPIRequest('/weapi/toplist/artist', data, cookie, response)
    },
  }
}
