// pages/login/login.js
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
  },

  /**
   * 组件的方法列表
   */
  methods: {

    showLogin(){
      this.setData({
        isShow: true
      })
    },

    hideLogin() {
      this.setData({
        isShow: false
      })
    },

    onGotUserInfo(e) {

      let _this = this
      if (e.detail.errMsg == "getUserInfo:ok"){
        //用户授权
        wx.login({
          success: function (res) {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://www.31un.com/api/public/?s=App.Album_User.GetWxOpenID',
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
                      var unionID = res2.data.data.unionid
                      
                      wx.request({
                        method: "post",
                        url: 'https://www.31un.com/api/public/?s=App.Album_User.WxLogin',
                        data: { openID: openID, name: name, head: head, unionID: unionID },
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
                          //登录成功
                          _this._confirmEvent()
                        }
                      })
                    }
                  })
                }, fail: (res2) => {
                  _this._cancelEvent()
                  console.log(res2)
                }
              })
            } else {
              _this._cancelEvent()
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });

      } else {
        _this._cancelEvent()
      }

    },

    _cancelEvent(){
      this.triggerEvent("cancelEvent")
    },

    _confirmEvent(){
      this.triggerEvent("confirmEvent")
    }

  }
})
