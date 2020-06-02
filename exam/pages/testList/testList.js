// pages/examList/examList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    height: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      },
    })

    this.getList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  getList() {
    wx.showLoading({
      title: '数据加载中',
    })
    
    wx.request({
      url: app.globalData.requestUrl + 'exam/getphtpaper',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      method: 'GET',
      success: (res) => {

        if (res.data.code == 200) {

          this.setData({
            list: res.data.data.papers
          })

          wx.hideLoading()

        }
      }
    })

  },

})