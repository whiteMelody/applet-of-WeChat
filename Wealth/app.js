//app.js
App({
  onLaunch: function () {

    //获取屏幕高宽
    wx.getSystemInfo({
        success: (res) => {
            this.globalData.windowWidth = res.windowWidth
            this.globalData.windowHeight = res.windowHeight
        }
    })  

    this.getUserInfo(function(r){
        // console.log(r)
    });
    
  },


  //保留2位小数
  twoDecimal: function (oNum) {
      var num = parseFloat(oNum);
      if (isNaN(length)) return false;

      var num = Math.round(oNum * 100) / 100;
      return num;
  },

  getUuid: function () {
      var len = 32;//32长度
      var radix = 16;//16进制
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); var uuid = [], i; radix = radix || chars.length; if (len) { for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]; } else { var r; uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; uuid[14] = '4'; for (i = 0; i < 36; i++) { if (!uuid[i]) { r = 0 | Math.random() * 16; uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; } } }
      return uuid.join('');
  },


  //获取用户接口
  getUserInfo: function (cb) {

      var that = this
      if (this.globalData.userInfo) {
          typeof cb == "function" && cb(that.globalData.userInfo)
      } else {

          //查看本地是否有数据
          wx.getStorage({
              key: "userInfo",
              success: function (res) {
                  if (res) {
                      that.globalData.userInfo = res.data;
                      cb(that.globalData.userInfo)
                  }
              },
              fail: function (res111) {
                  //调用微信登录
                  wx.login({
                      success: function (res222) {
                        //登录接口
                        wx.request({
                            url: 'https://www.31un.com/Cs/User/getWxOpenID', 
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                code: res222.code,
                            },
                           
                            success: function (res333) {

                                if(res333.data.code == 4000){

                                    //调用用户信息
                                    wx.getUserInfo({

                                        complete: function (res) {

                                            if (res.errMsg == "getUserInfo:cancel") {
                                                //默认生成一个userInfo
                                                res.userInfo = {};
                                            }

                                            res.userInfo.userId = that.getUuid();

                                            res.userInfo.openID = res333.data.data.openid;

                                            that.globalData.userInfo = res.userInfo
                                            typeof cb == "function" && cb(that.globalData.userInfo)

                                            //保存在本地

                                            wx.setStorage({
                                                key: 'userInfo',
                                                data: res.userInfo,
                                                complete: function () {
                                                    cb(res.userInfo);
                                                    wx.request({
                                                        url: 'https://www.31un.com/Cs/User/login',
                                                        method: 'POST',
                                                        header: {
                                                            'content-type': 'application/x-www-form-urlencoded'
                                                        },
                                                        data: {
                                                            openID: res333.data.data.openid,
                                                            name: res.userInfo.nickName,
                                                            head: res.userInfo.avatarUrl
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                      }
                  })
              }
          })
      }
  },

  globalData: {
    windowWidth: 0,
    windowHeight: 0
  }
})