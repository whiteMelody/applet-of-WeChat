// pages/audioList/audioList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    type: 1,          //筛选条件
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

    let title = '最近更新'

    if (options.type == 1){
      title = '最近更新'
    } else if (options.type == 2) {
      title = '热门作品'
    } else if (options.type == 3) {
      title = '本周主打推荐'
    } else if (options.type == 4) {
      title = '最佳推荐'
    } else if (options.type == 5) {
      title = '精品推荐'
    }

    wx.setNavigationBarTitle({
      title: title
    })
  
    this.setData({
      type: options.type
    })

    this.onReachBottom()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //最近更新
    //http://api.xemh.com/ht/indexList?type=1&page=1

    // 热门作品
    //http://api.xemh.com/ht/indexList?type=2&page=1

    // 本周主打推荐
    //http://api.xemh.com/ht/indexList?type=3&page=1

    // 最佳推荐
    //http://api.xemh.com/ht/indexList?type=4&page=1

    //精品推荐
    //http://api.xemh.com/ht/indexList?type=5&page=1

    // 分类
    //http://api.xemh.com/ht/categories
    
    //分类列表
    //http://api.xemh.com/ht/categoryDetails?id=-1&type_buy=0&type_over=0&type_order=1&page=1

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
      url: app.globalData.requestUrl + '?s=App.Cartoon_Common.IndexList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { type: this.data.type, page: page },
      method: 'POST',
      success: (res) => {

        if (res.data.data.code == 200) {

          let tmp = res.data.data.data

          let empty = false

          for (let i = 0; i < tmp.length; i++){
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