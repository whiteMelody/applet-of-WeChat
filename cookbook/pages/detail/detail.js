// pages/detail/detail.js

var WxParse = require('../wxParse/wxParse.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHot: false,
    id: '',
    food: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this

    this.setData({
      id: options.id
    })

    //获取菜谱详情
    wx.request({
      url: app.globalData.requestUrl + '?s=Cook.Cook_Food.Show',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { food_ids: options.id},
      method: 'POST',
      success: (res)=> {

        if (res.data.ret == 200) {

          
          WxParse.wxParse('steps', 'html', res.data.data[0].steps, _this, 5);

          this.setData({
            food: res.data.data[0]
          })


        }

      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  changeMy(){
    this.setData({
        isHot: false
    })
  },

  changeHot() {
      this.setData({
          isHot: true
      })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})