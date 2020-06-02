// pages/recite/recite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "请选择教材",
    grade: "请选择教材",
    rememberNum: 0,
    surplusNum: 0,
    width: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {





  },

  //单词列表
  getWordList(e) {
    let isGrade = this.data.isGrade
    let chapterID = this.data.chapterID

    if (isGrade) {
      wx.navigateTo({
        url: '/pages/wordList/wordList?chapterID=' + chapterID
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择教材',
        showCancel: false,
        success: function(res) {}
      })
    }
  },
  //速记
  remember(e) {
    let isGrade = this.data.isGrade
    let chapterID = this.data.chapterID

    if (isGrade) {
      wx.navigateTo({
        url: '/pages/shorthand/shorthand?chapterID=' + chapterID
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择教材',
        showCancel: false,
        success: function(res) {}
      })
    }
  },
  //单词拼写
  spell() {
    let isGrade = this.data.isGrade
    let chapterID = this.data.chapterID

    if (isGrade) {
      wx.navigateTo({
        url: '/pages/spell/spell?chapterID=' + chapterID
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择教材',
        showCancel: false,
        success: function(res) {}
      })
    }
  },
  //词义强化
  mean() {
    let isGrade = this.data.isGrade
    let chapterID = this.data.chapterID

    if (isGrade) {
      wx.navigateTo({
        url: '/pages/mean/mean?chapterID=' + chapterID
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择教材',
        showCancel: false,
        success: function(res) {}
      })
    }
  },
  //词汇强化
  vocabulary() {
    let isGrade = this.data.isGrade
    let chapterID = this.data.chapterID

    if (isGrade) {
      wx.navigateTo({
        url: '/pages/vocabulary/vocabulary?chapterID=' + chapterID
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择教材',
        showCancel: false,
        success: function(res) {}
      })
    }
  },
  //单元测试
  test() {
    let isGrade = this.data.isGrade
    let chapterID = this.data.chapterID

    if (isGrade) {
      wx.navigateTo({
        url: '/pages/test/test?chapterID=' + chapterID
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择教材',
        showCancel: false,
        success: function(res) {}
      })
    }
  },
  //上一单元
  last() {
    let isGrade = this.data.isGrade

    if (isGrade) {
      let bookList = this.data.bookList
      let bookID = this.data.bookID
      let index = this.data.index - 1
      let gradeList = this.data.gradeList

      if (index < 0) {
        wx.showModal({
          title: '提示',
          content: '已经是第一单元',
          showCancel: false,
          success: function(res) {}
        })
      } else {
        app.setBookIndex(bookID, index)
        let chapterID = gradeList[index].chapterID
        let rememberNum = this.data.rememberNum
        let res = app.getRememberID(chapterID)
        if (res) {
          rememberNum = res.rememberWord.length
        } else {
          rememberNum = 0
        }
        let surplusNum = gradeList[index].wordNum - rememberNum
        let width = rememberNum / gradeList[index].wordNum * 100
        this.setData({
          index: index,
          title: gradeList[index].title,
          surplusNum: surplusNum,
          rememberNum: rememberNum,
          chapterID: chapterID,
          width: width
        })
      }


    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择教材',
        showCancel: false,
        success: function(res) {}
      })
    }
  },
  //下一单元
  next() {
    let isGrade = this.data.isGrade

    if (isGrade) {
      let bookList = this.data.bookList
      let bookID = this.data.bookID
      let index = this.data.index + 1
      let gradeList = this.data.gradeList

      if (index == gradeList.length) {
        wx.showModal({
          title: '提示',
          content: '已经是最后一单元',
          showCancel: false,
          success: function(res) {}
        })
      } else {
        app.setBookIndex(bookID, index)
        let chapterID = gradeList[index].chapterID
        let rememberNum = this.data.rememberNum
        let res = app.getRememberID(chapterID)
        if (res) {
          rememberNum = res.rememberWord.length
        } else {
          rememberNum = 0
        }
        let surplusNum = gradeList[index].wordNum - rememberNum
        let width = rememberNum / gradeList[index].wordNum * 100
        this.setData({
          index: index,
          title: gradeList[index].title,
          surplusNum: surplusNum,
          rememberNum: rememberNum,
          chapterID: chapterID,
          width: width
        })
      }

    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择教材',
        showCancel: false,
        success: function(res) {}
      })
    }
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

    wx.stopBackgroundAudio()

    let getBooks = app.getBooks()
    // console.log(getBooks)
    let getBid = app.getCurrentBook()
    // console.log(getBid)
    if (app.isNull(getBooks)) {
      this.setData({
        isGrade: false
      })
    } else {
      let bookList = getBooks.filter((item) => {
        return item.bookID == getBid
      })
      let bookID = bookList[0].bookID
      let grade = bookList[0].grade
      let index = bookList[0].index
      let gradeList = bookList[0].gradeList
      let title = gradeList[index].title
      let chapterID = gradeList[index].chapterID
      let rememberNum = this.data.rememberNum
      let res = app.getRememberID(chapterID)
      if (res) {
        rememberNum = res.rememberWord.length
      } else {
        rememberNum = 0
      }
      let surplusNum = gradeList[index].wordNum - rememberNum
      let width = rememberNum / gradeList[index].wordNum * 100

      this.setData({
        isGrade: true,
        bookList: bookList,
        bookID: bookID,
        grade: grade,
        index: index,
        gradeList: gradeList,
        title: title,
        surplusNum: surplusNum,
        rememberNum: rememberNum,
        chapterID: chapterID,
        width: width
      })
    }

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
  onShareAppMessage: function() {

  }
})