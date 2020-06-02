// pages/login/login.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    disabled: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    showLogin() {
      this.setData({
        isShow: true
      })
    },

    hideLogin() {
      this.setData({
        isShow: false
      })
    },

    getUuid() {
      var len = 32; //32长度
      var radix = 16; //16进制
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var uuid = [],
        i;
      radix = radix || chars.length;
      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      return uuid.join('');
    },

    onGotUserInfo(e) {

      if (this.data.disabled) {
        return
      }
      this.setData({
        disabled: true
      })

      let _this = this

      if (app.isNull(e.detail.userInfo)) {
        return
      }

      wx.showLoading({
        title: '登录中',
      })

      let deviceID = this.getUuid()

      if (e.detail.errMsg == "getUserInfo:ok") {
        //用户授权
        wx.login({
          success: function(res) {
            if (res.code) {
              let code = res.code

              wx.getUserInfo({
                withCredentials: true,
                lang: 'zh_CN',
                success: function(res) {
                  let rawData = res.rawData
                  let signature = res.signature
                  let encryptedData = res.encryptedData
                  let iv = res.iv

                  let sign = app.getAjaxSign({
                    code: code,
                    encryptedData: encryptedData,
                    iv: iv,
                    rawData: rawData,
                    signature: signature,
                    deviceID: deviceID,
                    deviceType: '4',
                    source: 'WeChat_Applet'
                  })

                  wx.request({
                    method: "post",
                    url: app.globalData.requestUrl + 'api/user/loginWxSmallApp',
                    data: {
                      code: sign.code,
                      encryptedData: sign.encryptedData,
                      iv: sign.iv,
                      rawData: sign.rawData,
                      signature: sign.signature,
                      deviceID: sign.deviceID,
                      deviceType: sign.deviceType,
                      source: sign.source,
                      sign: sign.sign,
                      timestemp: sign.timestemp
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: function(res) {
                      if (res.data.status == 1) {
                        let name = res.data.returnJSON.nickName
                        let head = res.data.returnJSON.photoUrl
                        let openID = res.data.returnJSON.openList[0].openID
                        let userID = res.data.returnJSON.uuid
                        wx.setStorage({
                          key: "userinfo",
                          data: {
                            name,
                            head,
                            openID,
                            userID
                          },
                          success: function(res) {}
                        })
                        //登录成功
                        _this._confirmEvent()
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: res.data.message,
                          showCancel: false,
                          success: function(res) {}
                        })
                      }
                    }
                  })
                }
              })
            } else {
              _this._cancelEvent()
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })

      } else {
        _this._cancelEvent()
      }

    },

    _cancelEvent() {
      this.triggerEvent("cancelEvent")
    },

    _confirmEvent() {
      this.triggerEvent("confirmEvent")
    }

  }
})