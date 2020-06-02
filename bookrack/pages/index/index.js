//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      empty: true,
      isMenu: false,
  },
 
  onLoad() {
    
  },

  showMenu(){
      this.setData({
          isMenu: true
      })
  },

  hideMenu() {
      this.setData({
          isMenu: false
        })
    },

  scanCode(){
      // 允许从相机和相册扫码
      wx.scanCode({
          success: (res) => {
              console.log(res)
          }
      })
  },

})
