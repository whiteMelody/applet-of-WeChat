// pages/data/data.js

const app = getApp()
Page({

  data: {
    dataList: []
  },

  onLoad(options) {
    //获取资料库分类
    //获取数据
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + 'category/getCategorys',
      data: { userID: 0, deviceID: 0, type: 4 },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 1) {

          let _data = res.data.returnJSON

          console.log(_data)
          this.setData({
            dataList: _data
          })
        }

      }
    })

  },

  onShow() {

  },

  onShareAppMessage() {

  }

})