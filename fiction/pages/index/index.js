//index.js
const app = getApp()
Page({
  data: {
    bookShelf: [],
    check: true,
    showDelete: false,
    bookID: ""
  },

  onLoad: function() {

  },

  bindTouchStart: function(e) {
    this.startTime = e.timeStamp
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp
  },
  bindTap: function(e) {
    let bookID = e.currentTarget.dataset.bookid
    let bookName = e.currentTarget.dataset.bookname
    if (this.endTime - this.startTime < 350) {
      console.log("点击")
      this.setData({
        bookID: ""
      })
      wx.navigateTo({
        url: '/pages/read/read?bookID=' + bookID + '&bookName=' + bookName
      })
    }
  },
  bingLongTap: function(e) {
    console.log("长按")
    let bookID = e.currentTarget.dataset.bookid
    this.setData({
      bookID: bookID
    })
  },

  hide() {
    this.setData({
      bookID: ""
    })
  },

  delete(e) {
    let bookID = e.currentTarget.dataset.bookid
    let bookShelf = this.data.bookShelf 
    let tmp = bookShelf.filter((item) => {
      return item.bookID != bookID
    })
    app.setBookShelf(tmp)
    this.setData({
      bookShelf: tmp
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      bookID: ""
    })
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
    let bookShelf = app.getBookShelf()
    console.log(bookShelf)
    this.setData({
      bookShelf: bookShelf
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})