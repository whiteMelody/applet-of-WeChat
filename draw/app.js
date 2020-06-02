//app.js
App({

  getUuid: function () {
    var len = 32;//32长度
    var radix = 16;//16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); var uuid = [], i; radix = radix || chars.length; if (len) { for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]; } else { var r; uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; uuid[14] = '4'; for (i = 0; i < 36; i++) { if (!uuid[i]) { r = 0 | Math.random() * 16; uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; } } }
    return uuid.join('');
  },

  //保留2位小数
  twoDecimal: function (oNum) {
    var num = parseFloat(oNum);
    if (isNaN(length)) return false;

    var num = Math.round(oNum * 100) / 100;
    return num;
  },


  isNull: function isNull(obj) {
    if (obj == undefined || obj == 'undefined' || obj == null || obj == 'null' || obj == "" || obj.length == 0) return true; else return false;
  },

  //获取string的长度，可以传中文
  getByteLen: function (val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
      if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
        len += 2;
      else
        len += 1;
    };
    return len;
  },
  //截取string，可以传中文
  cutStrForNum: function (str, num) {
    var len = 0;
    var index = 0;
    for (var i = 0; i < str.length; i++) {
      if (str[i].match(/[^\x00-\xff]/ig) != null) //全角
        len += 2;
      else
        len += 1;
      index++;
      if (len >= num) {
        break;
      }
    }
    if (len >= num)
      newStr = str.substring(0, index) + "...";
    else
      newStr = str;
    return newStr;
  },

  getConfig(call){
    //获取配置文件

    wx.request({
      url: this.globalData.requestUrl + '?s=Doodle.Paint_Config.BaseConfig',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { },
      method: 'POST',
      success: (res)=> {
        if (res.data.ret == 200) {
          this.globalData.sysVerify = res.data.data.sysVerify
          this.globalData.worksVerify = res.data.data.worksVerify

          
          // call(true, true)

          call(res.data.data.sysVerify, res.data.data.worksVerify)

          // this.globalData.sysVerify = true
          // this.globalData.worksVerify = true
        }else{
          this.globalData.sysVerify = false
          this.globalData.worksVerify = false

          call(false, false)
        }
      },fail: (res)=>{
        this.globalData.sysVerify = false
        this.globalData.worksVerify = false

        call(false, false)
      }
    })
  },

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
            url: _this.globalData.requestUrl + '?s=Doodle.User_Basic.GetWxOpenID',
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
                    url: _this.globalData.requestUrl + '?s=Doodle.User_Basic.WxLogin',
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
                                  url: _this.globalData.requestUrl + '?s=Doodle.User_Basic.WxLogin',
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

  //全局临时对象（保存在系统缓存，而不是本地缓存）
  globalData: {
    requestUrl: 'https://www.31un.com/api/public/',           //线上
    // requestUrl: 'https://www.31un.com/test_api/public/',      //本地测试
    userInfo: {},
    tagList : [],
    indexEd: false,
    listEd: false,
    sysVerify: false,
    worksVerify: false,
  },

  createGif(){
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/index',
      data: {
        tag: tag,
        page: page,
        pageSize: pageSize,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },


})

