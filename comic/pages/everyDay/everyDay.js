// pages/everyDay/everyDay.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    let date = new Date();
    let _date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    if (!app.isNull(options.date)){
      _date = options.date
    }

    this.setData({
      date: _date
    })

  },

})