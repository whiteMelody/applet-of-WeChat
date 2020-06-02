// pages/lessonPlay/lessonPlay.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lesson: {},
    channel: {},
    playList: [],
    lrcs: [],
    currentPlay: 0,   //当前播放索引
    height: 0,          
    animationData: {},
    showDownload: false,
    showLrc: false,
    isPause: true,
    showMenu: false,
    currentTime: '',
    totleTime2: '',
    totleTime: 0,
    playTime: 0,
    playSeek: 0,
  },

  onLoad(options) {
    
    wx.getSystemInfo({
      success: (res)=> {
        this.setData({
          height: res.windowHeight
        })
      },
    })

    console.log(options.lessonID)

    this.init(options.lessonID)

  },

  onShow() {

    this.angle = 0

    var animation = wx.createAnimation({})

    this.animation = animation

    setInterval(()=>{
      if(!this.data.isPause){
        animation.rotate(this.angle).step()
        this.angle += 1
        if (this.angle >= 180) {
          this.angle = -180
        }
        this.setData({
          currentTime: this.parseMins(Number.parseInt((this.data.playTime))),
          playTime: Number.parseFloat(this.data.playTime + 0.1),
          playSeek: this.data.playTime / this.data.totleTime * 100,
          animationData: animation.export(),
        })
      }
    },100)
    
  },

  onUnload(){
    //销毁音频
    this.audioContext.destroy()
  },

  init(lessonID){

    //

    this.setData({
      lesson: {},
      channel: {},
      playList: [],
      currentPlay: 0,   //当前播放索引
      animationData: {},
      isPause: true,
      showMenu: false,
      currentTime: '',
      totleTime2: '',
      totleTime: 0,
      playTime: 0,
      playSeek: 0,
    })

    //加载课程
    wx.request({
      method: "post",
      url: 'https://api.7english.cn/lesson/getLessonByID',
      data: { lessonID: lessonID, userID: 0, deviceID: 0, type: 4, learningType: 0, rating: 0 },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 1) {

          let _data = res.data.returnJSON

          let _channelID = _data.channelID

          let lrc = app.isNull(_data.lrcURL) ? _data.txtURL : _data.lrcURL

          let _time = this.parseMins(_data.duration)

          this.loadLrc(lrc)

          this.loadMp3(_data.mp3URL)

          //加载课程
          wx.request({
            method: "post",
            url: 'https://api.7english.cn/lesson/getLessonsByChannelID',
            data: { channelID: _channelID, userID: 0, deviceID: 0, type: 4, learningType: 0, rating: 0 },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
              if (res.data.status == 1) {

                let _channel = res.data.extendInfo
                let _playList = res.data.returnJSON
                let _index = 0

                //判断播放的位置

                for (let i = 0; i < _playList.length; i++) {
                  if (lessonID == _playList[i].lessonID) {
                    _index = i
                    break
                  }
                }

                this.setData({
                  currentPlay: _index,
                  lesson: _data,
                  channel: _channel,
                  playList: _playList,
                  totleTime: _data.duration,
                  totleTime2: _time,
                })

              }

            }
          })

        }

      }
    })
  },


  /**
   * 加载音频
   */
  loadMp3(url){
    //创建audio组件
    this.audioContext = wx.createInnerAudioContext()

    this.audioContext.src = this.getUrlSign(url, 'A')

    //自动播放
    this.audioContext.onCanplay(()=>{
      this.play()
    })

    //监听结束
    this.audioContext.onEnded(()=>{
      console.log('播放完毕')
      this.pause()
      this.setData({
        currentTime: this.parseMins(0),
        playTime: 0,
        playSeek: 0,
      })
    })

  },

  /**
   * 下载lrc文件
   */
  loadLrc(lrc){
    
    let _this = this

    console.log(lrc)

    wx.downloadFile({
      url: lrc, //仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.playVoice({
            filePath: res.tempFilePath
          })

          const filePath = res.tempFilePath

          console.log(filePath)

          let fsm = wx.getFileSystemManager()

          fsm.readFile({
            filePath: filePath,
            encoding: 'utf-8',
            success(res) {
              //放入歌词数组

              let lrcs = []

              let _tmp = _this.parseLyric(res.data)

              for (let i = 0; i < _tmp.length; i++){

                lrcs.push({
                  index: i,
                  content: _tmp[i][1],
                  p1: _tmp[i][0],
                  p2: _tmp[i + 1] ? _tmp[i+1][0] : _tmp[i][0]
                })
              }

              console.log(lrcs)

              //

              _this.setData({
                lrcs: lrcs
              })

            },
            fail(res){
              console.log(res)
            }
          })

        }
      }
    })
    
  },

  /**
   * 播放url鉴权
   */
  getUrlSign(uri, type) {

    uri = encodeURI(uri);

    let fileName = uri.substring(uri.indexOf("/", 9));
    let _server = uri.substring(0, uri.indexOf("/", 9));
    let _timestamp = Math.round(new Date().getTime() / 1000) + 1800;
    let _rand = 0;
    let _uid = 0;
    let _PrivateKey = '7englishSplit6year'

    if (type == 'A') {
      let _str = fileName + '-' + _timestamp + '-' + _rand + '-' + _uid + '-' + _PrivateKey;
      let _md5hash = hex_md5(_str);
      let _str2 = _timestamp + '-' + _rand + '-' + _uid + '-' + _md5hash;
      let uri2 = _server + fileName + '?auth_key=' + _str2;
      return uri2;

    } else if (type == 'B') {

      _timestamp = Math.round(new Date().setSeconds(0).getTime() / 1000) + 1800;
      let _md5hash = hex_md5(_PrivateKey + _timestamp + fileName);
      let uri2 = _server + _timestamp + '/' + _md5hash + fileName;
      return uri2;

    } else if (type == 'C') {

      _timestamp = _timestamp.toString(16);
      let _md5hash = hex_md5(_PrivateKey + fileName);
      let uri2 = _server + _md5hash + '/' + _timestamp + fileName;
      return uri2;

    } else if (type == 'D') {

      _timestamp = _timestamp.toString(16);
      let _md5hash = hex_md5(_PrivateKey + fileName);
      let uri2 = _server + fileName + '?KEY1=' + _md5hash + '&KEY2=' + _timestamp;
      return uri2;

    }

    return null;

  },

  //转换分钟数 s：秒数
  parseMins(s) {
    let m1 = Math.floor(s / 60);
    let m2 = s % 60;
    if (m1 < 10) {
      m1 = "0" + m1;
    }
    if (m2 < 10) {
      m2 = "0" + m2;
    }
    return m1 + ":" + m2;
  },
  //转换秒数 t:时间
  parseSecond(t) {
    let t1 = parseInt(t.split(":")[0]);
    let t2 = parseInt(t.split(":")[1]);
    return t1 * 60 + t2;
  },

  /**
	 * 保留2位小数
	 * @param oNum			原始数值 {number}
	 * @returns {number}	新数值
	 */
  twoDecimal(oNum) {
    var num = parseFloat(oNum);
    if (isNaN(num)) return false;

    var num = Math.round(oNum * 100) / 100;
    return num;
  },

  /**
   * 转换歌词类型
   */
  parseLyric(text) {
    let lyric = text.split('\r\n'); //先按行分割
    let _l = lyric.length; //获取歌词行数
    let lrc = new Array(); //新建一个数组存放最后结果
    for (let i = 0; i < _l; i++) {
      let d = lyric[i].match(/\[\d{2}:\d{2}((\.|\:)\d{2})\]/g);  //正则匹配播放时间
      let t = lyric[i].split(d); //以时间为分割点分割每行歌词，数组最后一个为歌词正文
      if (d != null) { //过滤掉空行等非歌词正文部分
        //换算时间，保留两位小数
        let dt = String(d).split(':');
        let _t = Math.round(parseInt(dt[0].split('[')[1]) * 60 + parseFloat(dt[1].split(']')[0])) * 100 / 100;
        lrc.push([_t, t[1]]);
      }
    }

    return lrc;
  },

  /**
   * 打开菜单
   */
  openMenu(){
    this.setData({
      showMenu: true
    })
  },

  /**
   * 关闭菜单
   */
  closeMenu() {
    this.setData({
      showMenu: false
    })
  },

  /**
   * 打开lrc
   */
  openLrc() {
    this.setData({
      showLrc: true
    })
  },

  /**
   * 关闭lrc
   */
  closeLrc(){
    this.setData({
      showLrc: false
    })
  },

  /**
   * 播放
   */
  play(){
    this.audioContext.play()
    this.setData({
      isPause: false,
    })

  },

  /**
   * 暂停
   */
  pause() {
    this.audioContext.pause()
    this.setData({
      isPause: true,
    })
  },

  /**
   * 上一首
   */
  prev(){

    let _index = this.data.currentPlay - 1
    if (_index < 0) {
      _index = this.data.playList.length - 1
    }

    //判断是否免费
    if (_index < this.data.channel.freeLessonNum){
      this.audioContext.destroy()
      this.init(this.data.playList[_index].lessonID)
    }else{
      this.buyLesson(this.data.playList[_index].lessonID)
    }
    
  },

  /**
   * 下一首
   */
  next(){
    let _index = this.data.currentPlay + 1

    if (_index >= this.data.playList.length) {
      _index = 0
    }

    //判断是否免费
    if (_index < this.data.channel.freeLessonNum) {
      this.audioContext.destroy()
      this.init(this.data.playList[_index].lessonID)
    } else {
      this.buyLesson(this.data.playList[_index].lessonID)
    }

  },

  /**
   * 改变时间
   */
  changeing(e){

    this.pause()
    
  },

  changed(e){
    this.play()
    let seek = e.detail.value

    let currentTime = this.twoDecimal(seek / 100 * this.data.totleTime)

    this.audioContext.seek(currentTime)

    this.setData({
      currentTime: this.parseMins(currentTime),
      playTime: Number.parseFloat(currentTime),
      playSeek: currentTime / this.data.totleTime * 100,
    })

  },

  /**
   * 切歌
   */
  changePlay(e){
    this.audioContext.destroy()
    this.init(e.target.dataset.id)
  },

  /**
   * 购买课程
   */
  buyLesson(lessonID) {
    //暂无购买功能，提示用户下载app
    this.showDonwLoad()
  },

  showDonwLoad() {
    this.setData({
      showDownload: true
    })
  },

  closeDownload() {
    this.setData({
      showDownload: false
    })
  },

  copyUrl(e) {
    console.log()
    wx.setClipboardData({
      data: e.target.dataset.url,
      success: (res) => {
        // self.setData({copyTip:true}),
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: (res) => {
            this.closeDownload()
          }
        })
      }
    });
  },
  
})

var hexcase = 0;
var b64pad = "";
var chrsz = 8;
function hex_md5(s) { return binl2hex(core_md5(str2binl(s), s.length * chrsz)); }
function b64_md5(s) { return binl2b64(core_md5(str2binl(s), s.length * chrsz)); }
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function calcMD5(s) { return binl2hex(core_md5(str2binl(s), s.length * chrsz)); }

function md5_vm_test() {
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

function core_md5(x, len) {

  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;
  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

function md5_cmn(q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md5_ff(a, b, c, d, x, s, t) {
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function core_hmac_md5(key, data) {
  var bkey = str2binl(key);
  if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for (var i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

function bit_rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

function str2binl(str) {
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
  return bin;
}

function binl2hex(binarray) {
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
      hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
  }
  return str;
}

function binl2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i += 3) {
    var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
      | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
      | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
    }
  }
  return str;
}