# Netease Music API Server

### Main API
* 1 单曲播放地址(/v1/music/url)
  * params
    * id
    * br: default 128000, other(192000, 320000)

* 2 分类歌单(/v1/top/playlist)
  * params
    * offset: Optional
    * limit: Optional
    * order: default 'hot'
    * type: Optional, category_name

* 3 歌单详情(/v1/playlist/detail)
  * params
    * id
    * offset: Default 0
    * limit: default 20

* 4 排行榜(/v1//toplist)

* 5 排行榜详细(/v1/toplist/detail)
  * params
    * id: default 3778678

```
// 排行榜
    0: ['云音乐新歌榜', '/discover/toplist?id=3779629'],
    1: ['云音乐热歌榜', '/discover/toplist?id=3778678'],
    2: ['网易原创歌曲榜', '/discover/toplist?id=2884035'],
    3: ['云音乐飙升榜', '/discover/toplist?id=19723756'],
    4: ['云音乐电音榜', '/discover/toplist?id=10520166'],
    5: ['UK排行榜周榜', '/discover/toplist?id=180106'],
    6: ['美国Billboard周榜', '/discover/toplist?id=60198'],
    7: ['KTV嗨榜', '/discover/toplist?id=21845217'],
    8: ['iTunes榜', '/discover/toplist?id=11641012'],
    9: ['Hit FM Top榜', '/discover/toplist?id=120001'],
    10: ['日本Oricon周榜', '/discover/toplist?id=60131'],
    11: ['韩国Melon排行榜周榜', '/discover/toplist?id=3733003'],
    12: ['韩国Mnet排行榜周榜', '/discover/toplist?id=60255'],
    13: ['韩国Melon原声周榜', '/discover/toplist?id=46772709'],
    14: ['中国TOP排行榜(港台榜)', '/discover/toplist?id=112504'],
    15: ['中国TOP排行榜(内地榜)', '/discover/toplist?id=64016'],
    16: ['香港电台中文歌曲龙虎榜', '/discover/toplist?id=10169002'],
    17: ['华语金曲榜', '/discover/toplist?id=4395559'],
    18: ['中国嘻哈榜', '/discover/toplist?id=1899724'],
    19: ['法国 NRJ EuroHot 30周榜', '/discover/toplist?id=27135204'],
    20: ['台湾Hito排行榜', '/discover/toplist?id=112463'],
    21: ['Beatport全球电子舞曲榜', '/discover/toplist?id=3812895']
```

### Thanks
* [darknessomi/musicbox](https://github.com/darknessomi/musicbox) 
* [qaiyan/netmusic-node](https://github.com/sqaiyan/netmusic-node)
* [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
* [Himmas/NeteaseMusicApi](https://github.com/Himmas/NeteaseMusicApi)
* [网易云音乐新API简述](http://keyin.me/2017/02/08/netease-music-api/)
