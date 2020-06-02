//app.js

App({

  // 登录
  getUser(call) {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        let user = res;
        if (user) {
          call(user.data);
        } else {
          call(false);
        }
      }, fail: (res) => {
        call(false);
      }
    });

  },

  login: function (callback) {
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: _this.globalData.requestUrl + '?s=App.Album_User.GetWxOpenID',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res2) {

              //获取用户信息
              wx.getUserInfo({
                success: function (res) {
                  var openID = res2.data.data.openid
                  var name = res.userInfo.nickName
                  var head = res.userInfo.avatarUrl

                  wx.request({
                    method: "post",
                    url: _this.globalData.requestUrl + '?s=App.Album_User.WxLogin',
                    data: { openID: openID, name: name, head: head },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {

                      console.log(res)

                      var userID = res.data.data.user_id

                      wx.setStorage({
                        key: "userinfo",
                        data: { name, head, openID, userID },
                        success: function (res) {

                        }
                      })
                      if (callback) {
                        callback({ name, head, openID, userID });
                      }
                    }
                  })
                },
                fail: function (res) {

                  wx.showModal({
                    title: '温馨提示',
                    content: '检测到授权未成功，请前往开启授权，以保证功能的正常使用',
                    showCancel: false,
                    confirmText: '开启授权',
                    success: function (res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: (res) => {
                            //获取用户信息
                            wx.getUserInfo({
                              success: function (res) {

                                var openID = res2.data.data.openid
                                var name = res.userInfo.nickName
                                var head = res.userInfo.avatarUrl
                                wx.request({
                                  method: "post",
                                  url: 'https://www.31un.com/test_api/public/?s=App.Album_User.WxLogin',
                                  data: { openID: openID, name: name, head: head },
                                  header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                  },
                                  success: function (res) {

                                    var userID = res.data.data.user_id

                                    wx.setStorage({
                                      key: "userinfo",
                                      data: { name, head, openID, userID },
                                      success: function (res) {

                                      }
                                    })
                                    if (callback) {
                                      callback({ name, head, openID, userID });
                                    }
                                  }
                                })
                              },
                              fail: function (res) {

                              }
                            })
                          }
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              })
            }, fail: (res2) => {
              console.log(res2)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  onLaunch: function (options) {
  
  },

  isNull: function isNull(obj) {
    if (obj == undefined || obj == 'undefined' || obj == null || obj == 'null' || obj == "" || obj.length == 0) return true; else return false;
  },

  globalData: {
    sourceUrl: 'https://album.31un.com/teachersDay',          //资源地址
    requestUrl: 'https://www.31un.com/api/public/',           //线上
    // requestUrl: 'https://www.31un.com/test_api/public/',   //本地测试
    userInfo: {},
  },

})

