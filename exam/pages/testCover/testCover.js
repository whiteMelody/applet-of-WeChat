// pages/testCover/testCover.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    user: {},
    list: [],
    paper: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.login = this.selectComponent("#login");

    this.setData({
      id: options.id
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //判断用户登录

    let user = wx.getStorageSync('user')

    if (app.isNull(user)) {
      this.login.showLogin()
    } else {
      this.setData({
        user: JSON.parse(user)
      })

      this.getData()
    }
  },

  //取消事件 
  _cancelEvent() {
    wx.showToast({
      title: '登录取消',
      icon: 'none',
      duration: 1000
    })
    this.login.hideLogin()
  },
  //确认事件
  _confirmEvent() {
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })
    this.login.hideLogin()

    let user = wx.getStorageSync('user')

    this.setData({
      user: JSON.parse(user)
    })

    this.getData()
  },

  getData() {

    let openId = this.data.user.openID

    wx.request({
      url: app.globalData.requestUrl + 'exam/choicephtpaper',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        paperId: this.data.id
      },
      method: 'GET',
      success: (res) => {

        if (res.data.code == 200) {

          let list = res.data.data.items

          let paper = res.data.data.paper

          wx.setNavigationBarTitle({
            title: paper.name
          })

          paper.sum = res.data.data.sum

          paper.analysis = JSON.parse(paper.analysis)

          for (let i = 0; i < list.length; i++) {
            if (list[i].item_type == 'single') {
              //单选题
              list[i].selects = JSON.parse(list[i].content)
            } else if (list[i].item_type == 'multi') {
              //多选题
              list[i].selects = JSON.parse(list[i].content)
            } else if (list[i].item_type == 'fills') {
              //填空题
              list[i].content2 = JSON.parse(list[i].content)
            } else if (list[i].item_type == 'answer') {
              //解答题
              list[i].content2 = JSON.parse(list[i].content)
            } else if (list[i].item_type == 'charge') {
              //判断题
              list[i].selects = [{
                key: 'true',
                name: '正确'
              }, {
                key: 'false',
                name: '错误'
              },
              ]
            }

          }

          this.setData({
            paper: paper,
            list: list
          })

        }
      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})