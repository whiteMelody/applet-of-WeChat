//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  
  },
  onLoad() {
   
    this.login = this.selectComponent("#login");

  },

  onShow(){
    //判断用户登录

    let user = wx.getStorageSync('user')

    if(app.isNull(user)){
      this.login.showLogin()
    }else{
      // wx.navigateTo({
      //   url: '/pages/testCover/testCover?id=AFF44755-4ED9-4D56-AE7B-766CD36E8A2D',
      // })
    }

    // wx.request({
    //   url: '',
    // })

    // prepay/signature

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
    this.login.hideLogin()
    // wx.navigateTo({
    //   url: '/pages/testCover/testCover?id=AFF44755-4ED9-4D56-AE7B-766CD36E8A2D',
    // })
  },

  onShareAppMessage() {
   
  },
  
})
