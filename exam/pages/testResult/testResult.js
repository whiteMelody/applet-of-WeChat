// pages/testResult/testResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title: '',
    res: '',
    paperName: '',
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)

    //获取用户信息
    let user = wx.getStorageSync('user')

    this.setData({
      id: options.id,
      title: options.title,
      res: options.res,
      paperName: options.paperName,
      user: JSON.parse(user)
    })

  },

  onShareAppMessage() {
    return {
      path: '/pages/testCover/testCover?id=' + this.data.id
    }
  }
})