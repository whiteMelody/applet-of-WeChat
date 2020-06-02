//index.js
//获取应用实例
var app = getApp();
var page = 0, pageSize = 12, isEnd = false;

Page({
  data: {
    type: 1,
    width: "",
    width2: "",
    margin: "",
    height2: "",
    height: "",
    search: false,
    keyword: "",
    hidden: true,
    empty: false,
    init: false,
    datas: []
  },
  onLoad: function (options) {
    let _this = this;

    wx.getSystemInfo({
      success: function (res) {
        let [width, height] = [res.windowWidth, res.windowHeight];

        let width2 = (res.windowWidth - 40) / 3;

        _this.setData({
          'width': width,
          'width2': width2,
          'margin': 10,
          'height2': width2 / 4,
          'height': height,
          'init': true
        })
      }
    })

    if (options.type) { } else {
      options.type = 1;
    }

    _this.setData({
      'type': options.type
    })

    app.tagList(function (res) {
      app.globalData.tagList = res.data;
    })

    app.getUserInfo(function (res) {

    })

    // wx.login({

    //   complete: function(res) {
    //     console.log(res);
    //     wx.request({
    //     url: 'https://api.weixin.qq.com/sns/jscode2session',
    //     data: {
    //       appid : 'wx28f9288106a9c388',
    //       secret : '9bd04b8b0a1dc907b1c17adf2ade47b4',
    //       js_code : res.code,
    //       grant_type : 'authorization_code'
    //     },
    //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //     complete: function(data) {
    //       console.log(data);
    //     }
    //   })
    //   }
    // })

  },


  onShow: function () {

    // if (this.data.init) {
    //   page = 0, pageSize = 12, isEnd = false;
    //   this.setData({
    //     "datas": []
    //   })
    //   this.lower();
    // }

  },

  openSearch: function (e) {
    this.setData({
      "search": true
    })

  },

  closeSearch: function (e) {


  },


  toSearch: function (e) {

    let _this = this;

    wx.navigateTo({
      url: '../search/search?keyword=' + _this.data.keyword + "&search=true"
    })

  },


  eInput: function (e) {

    if (e.detail.value == "") {
      this.setData({
        "search": false
      })
    }

    this.setData({
      "keyword": e.detail.value
    })

  },

  lower: function (e) {
    let _this = this;

    if (isEnd) {
      return;
    }

    page++;

    _this.setData({
      hidden: false
    })

    app.getIndex("", page, pageSize, function (res) {

      if (res.data.list.length < pageSize) {
        isEnd = true;
      }

      _this.setData({
        'datas': _this.data.datas.concat(res.data.list)
      })
      _this.setData({
        hidden: true
      })
    })
  },


  onShareAppMessage: function () {
    return {
      title: '涂鸦神器',
      desc: '快乐无限，涂鸦神器，让您在创意的海洋中画出自己的作品',
      path: 'pages/index/index'
    }
  }


})
