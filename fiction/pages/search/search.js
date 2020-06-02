// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    hot: true,
    bookList: [],
    searchValue: "",
    searchHistory: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHot()
    this.getSearchHistory()
  },

  //获取搜索历史
  getSearchHistory() {
    let history = app.getHistory()
    console.log(history)
    if (app.isNull(history)) {
      this.setData({
        history: history,
        searchHistory: false
      })
    } else {
      this.setData({
        history: history,
        searchHistory: true
      })
    }
  },

  //获取热门
  getHot() {
    let _this = this
    wx.request({
      url: 'https://api.zhuishushenqi.com/book/hot-word',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      method: 'GET',
      success: function(res) {
        let tmp = res.data.newHotWords
        let arr1 = tmp.slice(0, 9)
        let arr2 = tmp.slice(9, 18)
        _this.setData({
          hotWords: arr1,
          arr1: arr1,
          arr2: arr2
        })
      }
    })
  },

  //换一批
  change() {
    let page = this.data.page
    let arr1 = this.data.arr1
    let arr2 = this.data.arr2
    if (page == 1) {
      this.setData({
        hotWords: arr2,
        page: 2
      })
    }
    if (page == 2) {
      this.setData({
        hotWords: arr1,
        page: 1
      })
    }
  },
  //获取input内容
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //搜索
  search() {
    let _this = this
    let hot = this.data.hot
    if (hot) {
      let bookName = this.data.inputValue
      let history = this.data.history
      if (app.isNull(bookName)) {
        return
      }

      let arr = history.filter((item) => {
        return item.bookName == bookName
      })
      console.log(arr)
      if (app.isNull(arr)) {
        let _arr = {
          bookName: bookName
        }
        history.push(_arr)
        app.setHistory(history)
      }

      wx.request({
        url: 'https://api.zhuishushenqi.com/book/fuzzy-search',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          query: bookName
        },
        method: 'GET',
        success: function(res) {
          let tmp = res.data.books
          for (let i = 0; i < tmp.length; i++) {
            tmp[i].cover = decodeURIComponent(tmp[i].cover.slice(7))
            tmp[i].wordCount = parseInt(tmp[i].wordCount / 10000)
          }

          _this.setData({
            hot: false,
            bookList: tmp
          })
        }
      })
    } else {
      _this.getSearchHistory()
      _this.setData({
        hot: true,
        searchValue: "",
        inputValue: ""
      })
    }
  },

  //选择热门
  select(e) {
    let word = e.currentTarget.dataset.word
    this.setData({
      searchValue: word,
      inputValue: word
    })
    this.search()
  },

  //清空搜索历史
  remove(){
    app.removeHistory()
    this.getSearchHistory()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})