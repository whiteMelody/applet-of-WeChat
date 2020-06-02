// pages/library/library.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    libraryList: [],
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // return
    this.getCategoryList()
  },

  //书库
  getCategoryList(call) {
    let _this = this
    let sign = app.getAjaxSign({
      uuid: '10000',
      deviceID: '10000',
      deviceType: '4',
      source: 'WeChat_Applet'
    })
    wx.request({
      url: app.globalData.requestUrl + 'api/books/categoryList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        uuid: sign.uuid,
        deviceID: sign.deviceID,
        deviceType: sign.deviceType,
        source: sign.source,
        sign: sign.sign,
        timestemp: sign.timestemp
      },
      method: 'POST',
      success: function(res) {
        let message = res.data.message
        if (res.data.status == 1) {
          let tmp = res.data.returnJSON
          _this.setData({
            libraryList: tmp,
            loading:false
          })
        } else {
          wx.showModal({
            title: '提示',
            content: message,
            showCancel: false,
            success: function(res) {}
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})