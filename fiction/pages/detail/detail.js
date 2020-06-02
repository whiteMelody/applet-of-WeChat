// pages/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    already: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.version((res) => {
      if (res) {
        this.setData({
          check: true
        })
      } else {
        this.setData({
          check: false
        })
      }
    })

    this.setData({
      author: options.author,
      bookName: options.bookName,
      intro: options.intro
    })
    wx.setNavigationBarTitle({
      title: options.bookName
    })
    this.getBookID(options.bookName, options.author)
  },

  //获取书籍ID
  getBookID(bookName, author) {
    let _this = this
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
        let arr = tmp.filter((item) => {
          return item.title == bookName
        })
        let _arr = tmp.filter((item) => {
          return item.author == author
        })
        if (app.isNull(_arr)) {
          return
        }
        let bookImg = decodeURIComponent((_arr[0].cover.slice(7)))
        let bookID = _arr[0]._id
        //判断加入书架没有
        let bookShelf = app.getBookShelf()
        if (!app.isNull(bookShelf)) {
          let _tmp = bookShelf.filter((item) => {
            return item.bookID == bookID
          })
          if (!app.isNull(_tmp)) {
            _this.setData({
              already: true
            })
          }
        }

        let wordCount = parseInt(_arr[0].wordCount / 10000)
        _this.setData({
          wordCount: wordCount,
          bookID: bookID,
          loading: false,
          book: _arr,
          bookShelf: bookShelf,
          bookImg: bookImg
        })
      }
    })
  },

  //加入书架
  add() {
    let already = this.data.already
    if (already) {
      return
    }
    let bookID = this.data.bookID
    let bookImg = this.data.bookImg
    let bookName = this.data.bookName
    let bookShelf = this.data.bookShelf
    let bookList = {
      bookID: bookID,
      bookImg: bookImg,
      bookName: bookName
    }
    bookShelf.unshift(bookList)
    app.setBookShelf(bookShelf)
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 1000
    })
    this.setData({
      already: true
    })
  },

  showDonwLoad() {
    this.setData({
      showDownload: true
    })
  },

  closeDownload() {
    this.setData({
      showDownload: false
    })
  },

  copyUrl(e) {
    wx.setClipboardData({
      data: e.target.dataset.url,
      success: (res) => {
        this.closeDownload()
      }
    });
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
  // onShareAppMessage: function() {

  // }
})