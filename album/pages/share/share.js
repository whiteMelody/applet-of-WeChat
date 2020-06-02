// pages/share/share.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo_id: "",
    userID:"",
    name: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this

    let cover = options.cover
    let photo_id = options.photo_id
    let name = options.name


    //获取屏幕高宽
    wx.getSystemInfo({
      success: (res) => {

        let windowHeight = res.windowHeight

        app.getUser((res) => {
          let head = res.head
          let userID = res.userID
          let userName = res.name

          _this.setData({
            windowHeight:windowHeight,
            userID: userID,
            userName: userName,
            name: name,
            head: head,
            cover: cover,
            photo_id: photo_id,
          })
        })
      }
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(this.data.userID)
    
    }
    return {
      title: this.data.userName + '邀请你加入相册',
      path: '/pages/make/make?photo_id=' + this.data.photo_id + '&invite_user=' + this.data.userID,
      // imageUrl: this.data.cover,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
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


})