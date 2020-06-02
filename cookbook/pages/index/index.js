//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    search: false,
    page: 0,
    pageSize: 20,
    keyword: "",
    list: [],
    cateList: [],
  },
 
  onLoad() {

    wx.request({
      url: app.globalData.requestUrl + '?s=Cook.Cook_Food.Index',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { page: 1, pageSize: 20},
      method: 'POST',
      success: (res)=> {
        if (res.data.ret == 200) {
          this.setData({
            list: res.data.data
          })
        }
      }
    })


    // //获取分类
    wx.request({
      url: app.globalData.requestUrl + '?s=Cook.Cook_Food.CateList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {  },
      method: 'POST',
      success: (res)=> {

        if (res.data.ret == 200) {
          this.setData({
            cateList: res.data.data
          })
        }

      }
    })

    // //获取菜谱详情

    // wx.request({
    //   url: app.globalData.requestUrl + '?s=App2.Cook_Food.Show',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   data: { food_ids: 1},
    //   method: 'POST',
    //   success: function (res) {

    //     if (res.data.ret == 200) {
    //       console.log(res.data.data)
    //     }

    //   }
    // })


  },

  openSearch: function (e) {
    this.setData({
      "search": true
    })
   
  },

  toCate(e){

    app.globalData.keywords = ''
    
    app.globalData.cateId = e.currentTarget.dataset.id

    console.log(e.currentTarget.dataset.id)

    wx.switchTab({
      url: '/pages/search/search'
    })

  },

  closeSearch: function (e) {
    wx.navigateTo({
      url: '/pages/search/search?keyword=' + _this.data.keyword + "&search=true"
    })

  },

  toSearch: function (e) {
    app.globalData.keywords = this.data.keyword

    app.globalData.cateId = ''

    wx.switchTab({
      url: '/pages/search/search'
    })
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

})
