// pages/activeDetail/activeDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
   
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
    //获取屏幕高宽
    wx.getSystemInfo({
      success: (res) => {

        console.log(res)

        this.setData({
          width: res.windowWidth,
          height: res.windowHeight,
        })

        const ctx = wx.createCanvasContext('myCanvas')

        ctx.setFillStyle('#F3F3F3');
        ctx.fillRect(0, 0, res.windowWidth, res.windowHeight);


        ctx.setFillStyle('#FFFFFF');

        ctx.fillRect(30, 30, res.windowWidth - 60, (res.windowWidth - 60) / 3 * 4);

        ctx.draw()
      }

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