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
    disabled: false,
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

      if (this.data.disabled)   return 

      this.setData({
        disabled: true
      })

      let _this = this
      if (e.detail.errMsg == "getUserInfo:ok"){
        //用户授权
        wx.login({
          success: (res)=> {

            if (res.code) {
              //发起网络请求
              wx.request({
                url: app.globalData.requestUrl + 'exam/auth',
                data: {
                  code: res.code
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: (res2)=> {

                  console.log(res2.data.data.openId)

                  wx.getUserInfo({
                    success: (res)=> {
                      let userInfo = {
                        openID: res2.data.data.openId,
                        name: res.userInfo.nickName,
                        head: res.userInfo.avatarUrl,
                      }

                      wx.setStorage({
                        key: 'user',
                        data: JSON.stringify(userInfo),
                      })

                      _this._confirmEvent()
                    }
                  })
                }, fail: (res2) => {
                 
                  _this._cancelEvent()
                }
              })
            } else {
             
              _this._cancelEvent()
            }
          }
        });

      } else {
        _this.setData({
          disabled: false
        })
        // _this._cancelEvent()
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
