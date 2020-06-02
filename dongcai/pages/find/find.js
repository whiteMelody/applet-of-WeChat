// pages/find/find.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {                       // 参数
      date: '',
      str_code: '2.8.2',
      city: '重庆',
      match_id: '',
      ip: '125.86.57.200',
      device_type: 'MI 6',
      source_code: 102,
      token: '4BED0C3493644B2CBF160345EEC3F6FA',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // dcb / team / newsList
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/team/newsList',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 200 || res.data.code == '200') {

        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {

  },

})