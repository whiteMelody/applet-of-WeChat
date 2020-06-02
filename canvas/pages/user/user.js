
var app = getApp();
var page = 1, pageSize = 12, isEnd = false;
Page({
  data: {
    userInfo: {},
    type: 1,
    width: "",
    width2: "",
    margin: "",
    height2: "",
    height: "",
    empty: false,
    hidden: true,
    datas: []

  },
  onLoad: function (options) {


  },
  onShow: function () {
    // 页面显示

    let _this = this;

    _this.clear();

    app.getUserInfo(function (res) {

      if (res) {
        _this.setData({
          userInfo: res
        })
      }

    })

    wx.getSystemInfo({
      success: function (res) {
        let [width, height] = [res.windowWidth, res.windowHeight];

        let width2 = (res.windowWidth - 40) / 3;

        _this.setData({
          'width': width,
          'width2': width2,
          'margin': 10,
          'height2': width2 / 4,
          'height': height
        })

        _this.getMyGif();
      }
    })

  },


  login: function () {
    let _this = this;

    wx.login({
      success: function () {
        wx.getUserInfo({

          complete: function (res) {

            if (res.errMsg != "getUserInfo:ok") {
              //默认生成一个userInfo
              res.userInfo = {};
            }

            res.userInfo.userId = app.getUuid();

            app.globalData.userInfo = res.userInfo
            _this.setData({
              userInfo: res.userInfo
            })

            //保存在本地

            wx.setStorage({
              key: 'userInfo',
              data: res.userInfo,
              complete: function () {
                _this.setData({
                  userInfo: res.userInfo
                })

                wx.request({
                  url: 'https://www.gmbridge.cn/draw/login',
                  data: res.userInfo
                })
              }
            })

          }
        })
      }
    })


  },

  clear: function () {
    page = 1;
    pageSize = 12;
    isEnd = false;
    this.setData({
      'datas': [],
      'hidden': false
    })
  },

  getMyGif: function (e) {
    let _datas;
    let _this = this;
    if (e) {
      _datas = e.currentTarget.dataset;
     _this.clear();
    } else {
      _datas = {
        type: 1
      }
      _this.setData({
        'hidden': false
      })
    }

    app.my(page, pageSize, function (res) {

      if (res.data.list.length < pageSize) {
        isEnd = true;
        _this.setData({
          'empty': false,
          'type': 1,
          'hidden': true
        })
      }

      if (res) {
        if (res.data.list.length == 0) {
          _this.setData({
            'empty': true,
            'type': 1,
            'hidden': true
          })
        } else {
          _this.setData({
            'datas': _this.data.datas.concat(res.data.list),
            'type': 1,
            'empty': false,
            'hidden': true
          })
        }
      } else {
        _this.setData({
          'empty': true,
          'type': 1,
          'hidden': true
        })
      }

    })
  },

  getMyFav: function (e) {
    let _this = this;
    let _datas;
    if (e) {
      _datas = e.currentTarget.dataset;
     _this.clear();
    } else {
      _datas = {
        type: 2
      }
      _this.setData({
        'hidden': false
      })
    }

    app.myCollect(page, pageSize, function (res) {

      if (res.data.list.length < pageSize) {
        isEnd = true;
        _this.setData({
          'empty': false,
          'type': 2,
          'hidden': true
        })
      }

      if (res) {
        if (res.data.list.length == 0) {
          _this.setData({
            'empty': true,
            'type': 2,
            'hidden': true
          })
        } else {
          _this.setData({
            'datas': _this.data.datas.concat(res.data.list),
            'type': 2,
            'empty': false,
            'hidden': true
          })
        }
      } else {
        _this.setData({
          'empty': true,
          'type': 2,
          'hidden': true
        })
      }

    })
  },

  lower: function (e) {
    let _this = this;

    if (isEnd) {
      return;
    }

    page++;

    if (_this.data.type == 1) {
      _this.getMyGif();

    } else {
      _this.getMyFav();

    }

  },

  onShareAppMessage: function () {
    return {
      title: '涂鸦神器',
      desc: '快乐无限，涂鸦神器，让您在创意的海洋中画出自己的作品',
      path: 'pages/index/index'
    }
  }


})