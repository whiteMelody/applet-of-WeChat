// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    search: false,
    cateList: [],
    datas: [],
    category_id: 0,
    page: 0,
    pageSize: 20,
    hidden: true,
    disable: false,
    empty: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.request({
      url: app.globalData.requestUrl + '?s=Cook.Cook_Food.CateList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      method: 'POST',
      success: (res) => {

        if (res.data.ret == 200) {
          console.log(res.data.data)
          this.setData({
            cateList: res.data.data
          })
        }

      }
    })
    
  },

  changeCate(e){
    let id = e.currentTarget.dataset.id
    
    if(id == 0){
      id = ''
    }

    this.setData({
      datas: [],
      category_id: id,
      page: 0,
      pageSize: 20,
      hidden: true,
      disable: false,
      empty: false,
    })

    this.onReachBottom()

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

    this.setData({
      datas: [],
      page: 0,
      pageSize: 20,
      hidden: true,
      disable: false,
      empty: false,
    })

    if (!app.isNull(app.globalData.keywords)) {
      this.setData({
        keyword: app.globalData.keywords
      })
    }

    if (!app.isNull(app.globalData.cateId)) {
      this.setData({
        category_id: app.globalData.cateId
      })
    }

    //search

    this.onReachBottom()

  },

  toSearch(){
    this.setData({
      datas: [],
      page: 0,
      pageSize: 20,
      hidden: true,
      disable: false,
      empty: false,
    })
    this.onReachBottom()
    
  },

  eInput: function (e) {

    if (e.detail.value == "") {
      this.setData({
        "search": false
      })
    }

    this.setData({
      "keyword": e.detail.value
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
    let _this = this

    if (this.data.disable == true) {
      return false;
    }
    let page = this.data.page
    let pageSize = this.data.pageSize
    page++;

    wx.request({
      url: app.globalData.requestUrl + '?s=Cook.Cook_Food.Index',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { page: page, pageSize: pageSize, keywords: this.data.keyword, category_id: this.data.category_id },
      method: 'POST',
      success: (res)=> {

        console.log(res.data.data)

        if (res.data.ret == 200) {

          let tmp = res.data.data

          var empty = false

          if (page > 1) {
            empty = false
          } else {
            //判断相册数量 如果有相册empty为false
            if (tmp.length > 0) {
              empty = false
            } else {
              empty = true
            }
          }

          if (tmp.length == 0 || tmp.length < 15) {
            console.log('暂无更多数据')
            _this.setData({
              disable: true,
            })
          }

          let datas = _this.data.datas;

          datas = datas.concat(tmp)

          _this.setData({
            empty: empty,
            datas: datas,
            page: page
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