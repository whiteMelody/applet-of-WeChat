// pages/paySuccess/paySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: options.money
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  backHome(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})