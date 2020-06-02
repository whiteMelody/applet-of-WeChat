//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    dialog: true,
    subject: 1,
    model: "c1",
    orderCount: 0,
    point: 0,
    testId: 0,
    examId: -1,
    loaded: false,
  },
  onLoad: function (options) {

    let _this = this;

    // wx.getSystemInfo({
    //   success: function(res) {
    //     console.log(res);
    //   }
    // })
    // return false;

    // 测试用户登录
    wx.login({
      
      complete: function(res) {
        console.log(res);
        wx.request({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        data: {
          appid : 'wx28f9288106a9c388',
          secret : '9bd04b8b0a1dc907b1c17adf2ade47b4',
          js_code : res.code,
          grant_type : 'authorization_code'
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        complete: function(data) {
          console.log(data);
        }
      })
      }
    })
  

    return false;

    // app.init(function (res) {

    //   if (res) {
    //     _this.setData({
    //       'loaded': true
    //     })
    //     console.log(res);
    //   }
    // });

    if (options.subject) { } else {
      options.subject = 1;
    }
    if (options.model) { } else {
      options.model = 'c1';
    }

    _this.setData({
      'subject': options.subject,
      'model': options.model
    })

  },

  onShow: function () {
    let _this = this;

    if (app.globalData.indexEd == true || app.globalData.indexEd == 'true') {
      _this.setData({
        'loaded': true
      });
    } else {
      _this.setData({
        'loaded': false
      });
    }

    app.getUserInfo(function (res1) {

      app.getIndexInfo(_this.data.subject, _this.data.model, function (res) {

        let [testId, testNum, examId, examNum] = [0, 0, -1, 0];

        if (res.data.data.order != null) {
          testId = Number.parseInt(res.data.data.order.count);
          testNum = res.data.data.order.number;
        }

        if (res.data.data.rand != null) {
          examId = Number.parseInt(res.data.data.rand.count);
          examNum = res.data.data.rand.number;
        }

        _this.setData({
          'orderCount': res.data.data.done || 0,
          'point': res.data.data.avg || 0,
          'testId': testId,
          'testNum': testNum,
          'examId': examId,
          'examNum': examNum,
        })

      })

    });

    wx.getStorage({
      key: 'indexEd',
      success: function (res) {
        app.globalData.indexEd = false;
        _this.setData({
          'loaded': false
        });
      },
      fail: function () {
        app.globalData.indexEd = true;
        _this.setData({
          'loaded': true
        });
      }
    })


  },

  openPanle: function () {
    var _flag = this.data.dialog;
    this.setData({
      'dialog': !_flag
    })
  },

  selectModel: function (e) {
    let model = e.currentTarget.dataset.model;

    this.setData({
      'model': model
    })
    this.openPanle();
  },

  closeLoad: function (e) {

    let _this = this;

    wx.setStorage({
      key: 'indexEd',
      data: false,
      success: function (res) {
        _this.setData({
          'loaded': false
        })
      }
    })


  },

  onShareAppMessage: function () {
    return {
      title: '驾考题库',
      desc: '最新最全的驾照考试信息',
      path: '/index/index'
    }
  }


})
