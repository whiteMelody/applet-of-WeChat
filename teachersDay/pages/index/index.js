//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    minHeight: 0,
    minWidth: 0,
  },

  onLoad() {

    // this.login = this.selectComponent("#login");

    // let _this = this

    // app.getUser((res) => {

    //   if (res) {

    //     _this.setData({
    //       userID: res.userID,
    //       page: 0,
    //       isLogin: true,
    //       photoList: [],
    //       disable: false
    //     })

    //     _this.login.hideLogin()

    //   } else {
    //     console.log('未登录')
    //     //未登录
    //     _this.login.showLogin()
    //   }

    // })

    wx.getSystemInfo({
      success: (res) => {

        this.setData({
          minWidth: res.windowWidth,
          minHeight: res.windowHeight,
        })

      },
    })

  },

  onShow() {

  },

  //取消事件 
  _cancelEvent(){
    wx.showToast({
      title: '登录取消',
      icon: 'none',
      duration: 1000
    })
    this.login.hideLogin()
  }, 
  //确认事件
  _confirmEvent(){

    let _this = this

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })

    app.getUser((res) => {

      if (res) {
        _this.setData({
          userID: res.userID,
          page: 0,
          isLogin: true,
          photoList: [],
          disable: false
        })

      } else {
        //未登录
        this.login.showLogin()
      }

    })


    this.login.hideLogin()
  },

  onShareAppMessage(e) {
    return {
      title: '快来测测你在老师眼里的形象，超准',
      path: '/pages/index/index',
      // imageUrl: '/images/teacherBg.jpg'
    }
  },

})
