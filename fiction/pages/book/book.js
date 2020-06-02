// pages/book/book.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    pageSize: 10,
    bookList: [],
    end: false,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      cg: options.name
    })
    this.onReachBottom()

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

    let _this = this
    if (this.data.end) {
      return false
    }
    let cg = this.data.cg
    let pageIndex = this.data.pageIndex
    let pageSize = this.data.pageSize
    pageIndex++
    // wx.showLoading({
    //   title: '加载中',
    // })
    let sign = app.getAjaxSign({
      cg: cg,
      pageIndex: pageIndex,
      pageSize: pageSize,
      uuid: '10000',
      deviceID: '10000',
      deviceType: '4',
      source: 'WeChat_Applet'
    })
    wx.request({
      url: app.globalData.requestUrl + 'api/books/bookList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cg: sign.cg,
        pageIndex: sign.pageIndex,
        pageSize: sign.pageSize,
        uuid: sign.uuid,
        deviceID: sign.deviceID,
        deviceType: sign.deviceType,
        source: sign.source,
        sign: sign.sign,
        timestemp: sign.timestemp
      },
      method: 'POST',
      success: function(res) {
        // wx.hideLoading()
        let message = res.data.message
        if (res.data.status == 1) {
          let tmp = res.data.returnJSON.indexData
          if (tmp.length == 0 || tmp.length < 10) {
            console.log('暂无更多数据')
            _this.setData({
              end: true
            })
          }
          let bookList = _this.data.bookList
          bookList = bookList.concat(tmp)
          _this.setData({
            bookList: bookList,
            pageIndex: pageIndex,
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
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})