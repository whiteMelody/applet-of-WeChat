//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    level: 0,
    width: 0
  },

  onLoad: function() {
    wx.hideShareMenu()

  },

  onShow: function() {

    this.login = this.selectComponent("#login")

    // app.getSocket()

    app.getUser((res) => {
      if (res) {
        this.setData({
          name: res.name,
          head: res.head,
          userID: res.userID
        })
        this.login.hideLogin()

        //获取用户等级
        app.getLevel((res) => {
          if (res) {
            // console.log(res)
            this.setData({
              level: res.level,
              width: res.width,
              levelName: res.levelName
            })
          } else {
            console.log('没有等级信息')
            app.getUserLevel((res) => {
              if (res) {
                this.setData({
                  level: res.level,
                  width: res.width,
                  levelName: res.levelName
                })
              }
            })
          }
        })
      } else {
        console.log('未登录')
        this.login.showLogin()
      }
    })

  },

  //取消事件 
  _cancelEvent() {
    wx.showToast({
      title: '登录取消',
      icon: 'none',
      duration: 1000
    })
    this.login.hideLogin()
  },

  //确认事件
  _confirmEvent() {
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })
    app.getUser((res) => {
      if (res) {
        this.setData({
          name: res.name,
          head: res.head,
          userID: res.userID
        })
        //连接Socket
        app.connectSocket()
        //获取等级
        app.getUserLevel((res) => {
          if (res) {
            this.setData({
              level: res.level,
              width: res.width,
              levelName: res.levelName
            })
          }
        })
      } else {
        //未登录
        this.login.showLogin()
      }
    })
    this.login.hideLogin()
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {

    let _this = this

    app.setRoomID(this.data.roomID)

    if (res.from === 'button') {

      return {
        title: '快来和' + this.data.name + '对战单词量',
        // imageUrl: this.data.inviteImg + '?x-oss-process=image/resize,m_fill,h_500,w_400,limit_0',
        path: '/pages/friend/friend?roomID=' + this.data.roomID + '&userID=' + this.data.userID,
        success: function(res) {

        },
        fail: function(res) {

        },
        complete: function(res) {
          wx.navigateTo({
            url: '/pages/friend/friend'
          })
        }
      }

    } else {
      return {
        title: '快来和' + this.data.name + '对战单词量',
        // imageUrl: this.data.inviteImg + '?x-oss-process=image/resize,m_fill,h_500,w_400,limit_0',
        path: '/pages/friend/friend?roomID=' + this.data.roomID + '&userID=' + this.data.userID,
        success: function(res) {


        },
        fail: function(res) {

        },
        complete: function(res) {
          wx.navigateTo({
            url: '/pages/friend/friend'
          })
        }
      }
    }

  }

})