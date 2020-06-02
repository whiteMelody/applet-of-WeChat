// pages/match/match.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.getSystemInfo((res) => {
      this.setData({
        height: res.windowHeight
      })
    })

  },

  getFightLevel() {
    let _this = this
    let userID = this.data.userID

    let sign = app.getAjaxSign({
      uuid: userID,
      deviceID: this.data.openID,
      deviceType: '4',
      source: 'WeChat_Applet'
    })

    wx.request({
      url: app.globalData.requestUrl + 'api/fight/fightLevel',
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
          let levelList = res.data.returnJSON
          // console.log(levelList)
          _this.setData({
            levelList: levelList
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

  battle(e) {
    let level = this.data.level
    let levelID = e.currentTarget.dataset.levelid

    if (level < levelID) {
      return false
    }

    wx.navigateTo({
      url: '/pages/battle/battle?level=' + levelID + '&mylevel=' + level
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

    app.getUser((res) => {
      if (res) {
        this.setData({
          userID: res.userID,
          name: res.name,
          head: res.head,
        })
        this.getFightLevel()
      }
    })

    app.getLevel((res) => {
      if (res) {
        // console.log(res)
        this.setData({
          level: res.level,
          levelName: res.levelName,
          width: res.width,
          exp: res.exp
        })
      } else {
        console.log('没有等级信息')
        app.getUserLevel((res) => {
          if (res) {
            this.setData({
              level: res.level,
              levelName: res.levelName,
              width: res.width,
              exp: res.exp
            })
          }
        })
      }
    })

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