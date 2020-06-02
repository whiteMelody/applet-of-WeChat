// pages/audioList/audioList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    id: -1,           //筛选条件  -1代表全部
    type_buy: -1,     //是否付费 -1 全部 | 0 免费 | 1 付费
    type_over: -1,    //是否完结 -1 全部 | 0 完结 | 1 连载中
    type_order: 0,   //排序条件 0 热门 | 1 最新 
    type:2,
    page: 0,
    pageSize: 20,
    inited: false,
    hidden: true,
    disable: false,
    empty: false,
    category: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //首页推荐
    wx.request({
      url: app.globalData.requestUrl + '?s=App.Cartoon_Common.Category',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      method: 'GET',
      success: (res) => {
        console.log(res.data.data.data)

        if (res.data.data.code == 200) {
          this.setData({
            category: res.data.data.data
          })
        }

      }
    })

    this.onReachBottom()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  filtrate(){
    this.setData({
      datas: [],
      page: 0,
      pageSize: 20,
      inited: false,
      hidden: true,
      disable: false,
      empty: false,
    })
    
    this.onReachBottom()
  },

  changeId(e){
    this.setData({
      id: e.currentTarget.dataset.id || e.currentTarget.target.id
    })
    this.filtrate()
  },

  changeBuy(e){
    this.setData({
      type_buy: e.currentTarget.dataset.id || e.currentTarget.target.id
    })
    this.filtrate()  
  },
  
  changeOver(e) {
    this.setData({
      type_over: e.currentTarget.dataset.id || e.currentTarget.target.id
    })
    this.filtrate() 
  },

  changeOrder(e) {
    this.setData({
      type_order: e.currentTarget.dataset.id || e.currentTarget.target.id
    })
    this.filtrate() 
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
      url: app.globalData.requestUrl + '?s=App.Cartoon_Common.CategoryDetails',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { id: this.data.id, type_buy: this.data.type_buy, type_over: this.data.type_over, type_order: this.data.type_order, page: page },
      method: 'POST',
      success: (res) => {

        if (res.data.data.code == 200) {

          let tmp = res.data.data.data

          let empty = false

          for (let i = 0; i < tmp.length; i++) {
            tmp[i].time2 = app.timestampToTime(tmp[i].book_chaptertime)
          }

          if (page > 1) {
            empty = false
          } else {
            if (tmp.length > 0) {
              empty = false
            } else {
              empty = true
            }
          }

          if (tmp.length == 0 || tmp.length < 10) {
            console.log('暂无更多数据')
            _this.setData({
              disable: true,
            })
          }

          let datas = _this.data.datas;

          if (this.data.inited) {
            datas = datas.concat(tmp)
          } else {
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