// pages/audioList/audioList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取数据
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + 'channel/getAudioChannelsByCategoryIDV2',
      data: { categoryID: options.categoryID, userID: 0, deviceID: 0, type: 4 },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 1) {

          let _data = res.data.returnJSON

          this.setData({
            datas: _data,
          })

        }

      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})