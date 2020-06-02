// pages/audioList/audioList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    page: 0,
    pageSize: 20,
    inited: false,
    hidden: true,
    disable: false,
    empty: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onReachBottom()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let _this = this

    if (this.data.disable == true) {
      return false;
    }
    let page = this.data.page
    let pageSize = this.data.pageSize
    page++;

    wx.request({
      url: app.globalData.requestUrl + 'hot/getHotAudioChannelV2',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { pageIndex: page, pageSize: pageSize, userID: 0, rating: 0, deviceID: 'wap', type: 4 },
      method: 'POST',
      success: (res) => {

        if (res.data.status == 1) {

          let tmp = res.data.returnJSON

          var empty = false

          if (page > 1) {
            empty = false
          } else {
            if (tmp.length > 0) {
              empty = false
            } else {
              empty = true
            }
          }

          if (tmp.length == 0 || tmp.length < 20) {
            console.log('暂无更多数据')
            _this.setData({
              disable: true,
            })
          }

          let datas = _this.data.datas;

          if (this.data.inited){
            datas = datas.concat(tmp)
          }else{
            datas = tmp
          }

          _this.setData({
            inited: true,
            empty: empty,
            datas: datas,
            page: page
          })

        }

      }
    })
  },


})